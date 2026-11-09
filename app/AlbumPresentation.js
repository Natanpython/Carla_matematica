'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, X, Maximize, Minimize, RotateCcw, BookOpen } from 'lucide-react';
import { slides, sourcesForSpread } from '../data/album';
import { chapters } from '../data/content';
import PhotoBook from './PhotoBook';

export default function AlbumPresentation({initialIndex=0,initialPlaying=false,onClose}) {
  const [index,setIndex]=useState(initialIndex),[playing,setPlaying]=useState(initialPlaying);
  const [delay,setDelay]=useState(7),[full,setFull]=useState(false),[entering,setEntering]=useState(initialIndex===0);
  const [zoom,setZoom]=useState(null),[notice,setNotice]=useState('');
  const dialog=useRef(null),zoomDialog=useRef(null),intro=useRef(null),zoomTrigger=useRef(null);
  const slide=slides[index],images=sourcesForSpread(slide);
  const advance=useCallback(direction=>setIndex(i=>Math.max(0,Math.min(slides.length-1,i+direction))),[]);
  const closeZoom=useCallback(()=>{setZoom(null);requestAnimationFrame(()=>zoomTrigger.current?.focus());},[]);
  const close=useCallback(()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});onClose();},[onClose]);
  function highlight(photo,event){zoomTrigger.current=event.currentTarget;setPlaying(false);setZoom(photo);}
  function moveZoom(direction){const next=images.indexOf(zoom.src)+direction;if(images[next])setZoom({src:images[next],alt:`${slide.label} — fotografia ${next+1}`});}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.current.requestFullscreen();}catch{setNotice('Use F11 no navegador para ampliar a apresentação.');}}

  useEffect(()=>{
    const before=document.activeElement,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';dialog.current?.focus();
    return()=>{document.body.style.overflow=overflow;before?.focus();};
  },[]);
  useEffect(()=>{if(!entering)return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setEntering(false);return;}const timer=setTimeout(()=>setEntering(false),2400);return()=>clearTimeout(timer);},[entering]);
  useEffect(()=>{if(zoom)zoomDialog.current?.focus();},[zoom]);
  useEffect(()=>{const listener=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',listener);return()=>document.removeEventListener('fullscreenchange',listener);},[]);
  useEffect(()=>{
    function key(event){
      if(event.key==='Escape'){event.preventDefault();zoom?closeZoom():close();return;}
      if(event.key==='Tab'){
        const scope=zoom?zoomDialog.current:entering?intro.current:dialog.current;
        const nodes=[...scope.querySelectorAll('button:not(:disabled),select')].filter(el=>el.getClientRects().length>0&&!el.closest('[inert]'));
        const first=nodes[0],last=nodes.at(-1);
        if(!nodes.length)return;
        if(event.shiftKey&&(!nodes.includes(document.activeElement)||document.activeElement===first)){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&(!nodes.includes(document.activeElement)||document.activeElement===last)){event.preventDefault();first.focus();}
        return;
      }
      if(event.target.tagName==='SELECT'||entering)return;
      if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;if(zoom)moveZoom(direction);else advance(direction);}
      if(event.code==='Space'&&event.target.tagName!=='BUTTON'&&!zoom){event.preventDefault();setPlaying(value=>!value);}
    }
    document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
  });
  useEffect(()=>{if(!playing||entering||zoom)return;if(index===slides.length-1){setPlaying(false);return;}const timer=setTimeout(()=>advance(1),delay*1000);return()=>clearTimeout(timer);},[index,playing,delay,entering,zoom,advance]);
  useEffect(()=>{if(slides[index+1])for(const src of sourcesForSpread(slides[index+1])){const image=new window.Image();image.src=src;}},[index]);

  return <div className="viewer cinema-viewer" role="dialog" aria-modal="true" aria-label="Apresentação do álbum" tabIndex={-1} ref={dialog}>
    <div className="presentation-frame" inert={zoom||entering?true:undefined}>
      <div className="viewer-top"><span><BookOpen size={16}/> MATEMÁTICA EM FOCO <small> / {slide.label}</small></span><div><span className="live-mode"><i/>{playing?'EM EXIBIÇÃO':'NO SEU TEMPO'}</span><button onClick={fullscreen} aria-label={full?'Sair da tela cheia':'Tela cheia'}>{full?<Minimize/>:<Maximize/>}</button><button onClick={close} aria-label="Fechar apresentação"><X/></button></div></div>
      <div className="chapter-navigation" aria-label="Navegar pela apresentação"><button className={!slide.chapter&&index<2?'current':''} onClick={()=>setIndex(0)} aria-label="Ir para a abertura">Abertura</button>{chapters.map(chapter=><button key={chapter.id} className={slide.chapter===chapter.id?'current':''} aria-current={slide.chapter===chapter.id?'step':undefined} aria-label={`Ir para a ${chapter.id}ª formação`} onClick={()=>setIndex(slides.findIndex(s=>s.chapter===chapter.id))}><span>0{chapter.id}</span>{chapter.month}</button>)}<button className={index>=slides.length-2?'current':''} onClick={()=>setIndex(slides.length-2)} aria-label="Ir para o encerramento">Encerramento</button></div>
      <PhotoBook slides={slides} index={index} onAdvance={advance} onHighlight={highlight}/>
      <div className="viewer-controls"><div className="slide-count">{String(index+1).padStart(2,'0')} <span>/ {slides.length}</span><small>ABERTURAS DO ÁLBUM</small></div><div className="play-controls"><button aria-label="Registro anterior" disabled={index===0} onClick={()=>advance(-1)}><ArrowLeft/></button><button className="play-toggle" aria-label={playing?'Pausar apresentação':index===slides.length-1?'Reiniciar apresentação':'Reproduzir apresentação'} onClick={()=>{if(index===slides.length-1)setIndex(0);setPlaying(p=>!p);}}>{playing?<Pause size={18}/>:index===slides.length-1?<RotateCcw size={18}/>:<Play size={18}/>}<span>{playing?'Pausar':index===slides.length-1?'Reiniciar':'Reproduzir'}</span></button><button aria-label="Próximo registro" disabled={index===slides.length-1} onClick={()=>advance(1)}><ArrowRight/></button></div><label className="speed">Ritmo <select value={delay} onChange={event=>setDelay(Number(event.target.value))}>{[5,7,10,15,20].map(value=><option key={value} value={value}>{value} s</option>)}</select></label></div>
      <div className="cinema-progress" aria-hidden="true">{slides.map((item,i)=><span key={i} className={`${i<index?'completed':''} ${i===index?'selected':''}`}><i key={`${index}-${delay}-${playing}-${entering}`} style={i===index&&playing&&!entering?{animation:`reading-progress ${delay}s linear forwards`}:undefined}/></span>)}</div>
      <span className="sr-only" aria-live="polite">Abertura {index+1} de {slides.length}</span>
    </div>
    {entering&&<div className="album-entrance" ref={intro}><div className="entrance-light"/><div className="entrance-book" aria-hidden="true"><div className="entrance-book-edge"/><div className="entrance-cover"><div className="cover-border"/><span className="cover-topline">REDE MUNICIPAL DE BAYEUX</span><div className="cover-title">Matemática<br/>em <em>foco.</em></div><div className="cover-rule"/><span className="cover-subtitle">Um álbum de encontros.<br/>Uma história de transformação.</span><span className="cover-footnote">MEMÓRIAS DAS FORMAÇÕES · 5º E 6º ANO</span></div></div><p>Algumas histórias merecem ser revisitadas.</p><button onClick={()=>{setEntering(false);dialog.current?.focus();}}>Pular abertura <ArrowRight size={14}/></button></div>}
    {zoom&&<div className="photo-spotlight" role="dialog" aria-modal="true" aria-label="Fotografia em destaque" tabIndex={-1} ref={zoomDialog}><div className="spotlight-top"><span>{slide.label}<small>UM INSTANTE PARA OLHAR DE PERTO</small></span><button onClick={closeZoom} aria-label="Voltar ao álbum"><X size={23}/></button></div><div className="spotlight-image"><img src={zoom.src} alt={zoom.alt}/></div><div className="spotlight-bottom"><button onClick={()=>moveZoom(-1)} disabled={images.indexOf(zoom.src)===0} aria-label="Foto anterior em destaque"><ArrowLeft size={18}/></button><span>{images.indexOf(zoom.src)+1} / {images.length}<small>O álbum está pausado</small></span><button onClick={()=>moveZoom(1)} disabled={images.indexOf(zoom.src)===images.length-1} aria-label="Próxima foto em destaque"><ArrowRight size={18}/></button></div></div>}
    {notice&&<button className="notice" onClick={()=>setNotice('')}>{notice}</button>}
  </div>;
}
