const { test, expect } = require('@playwright/test');
test('navegação entre encontros e apresentação manual e automática', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Matemática em foco.' })).toBeVisible();
  await page.getByRole('tab', { name: /4ª formação/ }).click();
  await expect(page.getByRole('heading', { name: 'Uma matemática para todos' })).toBeVisible();
  await page.getByRole('button', { name: 'Ampliar convite da formação' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Reproduzir apresentação', exact: true })).toBeVisible();
  const before = await dialog.locator('.slide-count').textContent();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('.slide-count')).not.toHaveText(before);
  await dialog.getByRole('combobox').selectOption('5');
  await dialog.getByRole('button', { name: 'Reproduzir apresentação', exact: true }).click();
  const current = await dialog.locator('.slide-count').textContent();
  await expect(dialog.locator('.slide-count')).not.toHaveText(current, { timeout: 8000 });
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Ampliar convite da formação' })).toBeFocused();
});
test('layout móvel sem transbordamento e imagens acessíveis', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  for (let i=0;i<4;i++) {
    await page.getByRole('tab').nth(i).click();
    const images=page.locator('.chapter-panel img');
    for(let j=0;j<await images.count();j++) {
      await images.nth(j).scrollIntoViewIfNeeded();
      await expect.poll(()=>images.nth(j).evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
    }
  }
});

test('álbum vira nos dois sentidos e respeita movimento reduzido', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Ampliar convite da formação'}).click();
  const book=page.locator('.book-spread');
  await page.getByRole('button', {name:'Próximo registro'}).click();
  await expect(book).toHaveAttribute('data-direction','forward');
  await expect(book).toHaveAttribute('data-direction','still');
  await page.getByRole('button', {name:'Registro anterior'}).click();
  await expect(book).toHaveAttribute('data-direction','backward');
  await expect(book).toHaveAttribute('data-direction','still');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button', {name:'Próximo registro'}).click();
  await expect(page.locator('.slide-count')).toContainText('04');
  await expect(page.locator('.turn-layer')).toHaveCount(0);
});

test('celular mantém o relato visível e permite deslizar a página', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.getByRole('button', {name:'Ampliar convite da formação'}).click();
  await expect(page.locator('.book-spread > .paper-right .mobile-story p')).toBeVisible();
  const stage=page.locator('.book-stage');
  await stage.evaluate(el=>{
    const touch=(x,y)=>new Touch({identifier:1,target:el,clientX:x,clientY:y});
    el.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,changedTouches:[touch(310,400)]}));
    el.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[touch(70,405)]}));
  });
  await expect(page.locator('.slide-count')).toContainText('04');
  await expect(page.locator('.book-spread')).toHaveAttribute('data-direction','still');
  expect(await page.locator('.viewer').evaluate(el=>el.scrollWidth<=window.innerWidth)).toBeTruthy();
  await expect(page.locator('.book-spread > .paper-left .album-photograph')).toBeVisible();
  await expect(page.locator('.book-spread > .paper-right .album-photograph')).toBeVisible();
});

test('sequência completa sem fotos repetidas, com texto apenas nas aberturas', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:'Apresentar álbum',exact:true}).click();
  await page.getByRole('button',{name:'Pausar apresentação',exact:true}).click();
  const seen=new Set();
  let photos=0,cards=0,triple=0;
  const book=page.locator('.book-spread');
  while(true){
    const type=await book.getAttribute('data-type');
    const sources=await book.locator(':scope > .paper-page img').evaluateAll(images=>images.map(img=>img.getAttribute('src')));
    for(const source of sources){expect(seen.has(source),`Imagem repetida: ${source}`).toBeFalsy();seen.add(source);}
    if(type==='photos'){
      expect(sources.length).toBeGreaterThanOrEqual(2);
      expect(sources.length).toBeLessThanOrEqual(3);
      if(sources.length===3)triple++;
      photos+=sources.length;
      await expect(book.locator(':scope > .paper-page .book-story')).toHaveCount(0);
      await expect(book.locator(':scope > .paper-left .album-photograph')).toHaveCount(1);
    }else if(type==='card'){
      cards++;
      await expect(book.locator(':scope > .paper-left .book-story p')).toBeVisible();
      expect(sources).toHaveLength(1);
    }else if(type==='opening'){
      expect(sources).toHaveLength(1);
      await expect(book.locator(':scope > .paper-right img')).toBeVisible();
    }else{expect(sources).toHaveLength(0);}
    const next=page.getByRole('button',{name:'Próximo registro'});
    if(await next.isDisabled())break;
    await next.click();
  }
  expect(photos).toBe(41);expect(cards).toBe(4);expect(triple).toBe(1);expect(seen.size).toBe(47);
});

test('clique na segunda fotografia abre a dupla correta', async ({ page }) => {
  await page.goto('/');
  const image=page.locator('.gallery-photo').nth(1);
  const src=await image.locator('img').getAttribute('src');
  await image.click();
  await expect(page.locator('.book-spread')).toHaveAttribute('data-type','photos');
  await expect(page.locator('.book-spread > .paper-right img')).toHaveAttribute('src',src);
});

test('capa de entrada e atalhos dos capítulos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir nosso álbum',exact:true}).click();
  await expect(page.locator('.album-entrance')).toBeVisible();
  await page.getByRole('button',{name:'Pular abertura'}).click();
  await expect(page.locator('.album-entrance')).toHaveCount(0);
  await page.getByRole('button',{name:'Pausar apresentação',exact:true}).click();
  await page.getByRole('button',{name:'Ir para a 3ª formação',exact:true}).click();
  await expect(page.locator('.book-spread')).toHaveAttribute('data-type','card');
  await expect(page.locator('.book-spread > .paper-left h2')).toHaveText('Aprender também é jogar');
  await expect(page.getByRole('button',{name:'Ir para a 3ª formação',exact:true})).toHaveAttribute('aria-current','step');
});

test('foto em destaque pausa o álbum e devolve o foco à mesma página', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.locator('.gallery-photo').first().click();
  const before=await page.locator('.slide-count').textContent();
  await page.getByRole('button',{name:'Reproduzir apresentação',exact:true}).click();
  const trigger=page.getByRole('button',{name:'Destacar memória 1',exact:true});
  await trigger.click();
  const spotlight=page.getByRole('dialog',{name:'Fotografia em destaque',exact:true});
  await expect(spotlight).toBeVisible();
  await expect(page.locator('.presentation-frame')).toHaveAttribute('inert','');
  const first=await spotlight.locator('img').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await expect(spotlight.locator('img')).not.toHaveAttribute('src',first);
  await page.keyboard.press('Escape');
  await expect(spotlight).toHaveCount(0);
  await expect(page.locator('.slide-count')).toHaveText(before);
  await expect(page.getByRole('button',{name:'Reproduzir apresentação',exact:true})).toBeVisible();
  await expect(trigger).toBeFocused();
});
