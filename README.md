# Matemática em foco

Álbum em Next.js das quatro formações de Matemática da Rede Municipal de Bayeux.

## Executar

Requer Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para produção: `npm run build` e `npm start`.

## Apresentação

Use “Apresentar álbum” para iniciar a sequência completa ou “Apresentar este encontro” para começar em uma formação. Clique em uma imagem para abrir no modo manual. Setas do teclado avançam e voltam; espaço alterna reprodução quando o foco está fora dos botões; Escape fecha. O intervalo pode ser ajustado de 5 a 20 segundos. A apresentação termina nos créditos, sem reiniciar automaticamente. O botão de tela cheia pode exigir suporte do navegador; F11 é uma alternativa em computadores.

A apresentação tem formato de livro aberto, com virada de folhas em 3D nos dois sentidos. Cada formação começa com texto e convite; as aberturas seguintes mostram fotos nas duas páginas. Os 41 registros aparecem uma vez na apresentação. A última abertura da terceira formação contém três fotos para acomodar sua quantidade ímpar. As duas imagens extras da pasta midia/Abertura do album ilustram a abertura e a apresentação, uma vez cada. O encerramento usa uma dedicatória tipográfica.

No celular, as duas páginas de fotos ficam empilhadas e também é possível avançar ou voltar deslizando o dedo. A preferência do sistema por movimento reduzido desativa as animações. Capa, fitas, marcadores e sólidos geométricos usam a paleta da logo da Secretaria.

A entrada completa abre com uma capa animada; o avanço automático só começa depois dessa entrada, que pode ser pulada. A barra superior permite ir diretamente a cada formação. Clique em uma foto do livro para destacá-la: o álbum pausa, as setas percorrem as imagens daquela abertura e Escape retorna à mesma página. A reprodução permanece pausada até ser retomada. A apresentação tem iluminação escura ao redor do livro e um indicador do tempo de cada abertura.

As imagens são locais e os originais foram preservados. A tipografia usa fontes do sistema, sem depender de conexão durante a apresentação.

## Conteúdo

- `data/content.js`: textos, temas e capas.
- `data/album.js`: sequência da apresentação e agrupamento das fotos.
- `data/media.json`: organização das imagens; o campo `original` permite rastrear a origem.
- `public/media`: cópias utilizadas pela aplicação.
- `CURADORIA.md`: fontes, duplicatas e pendências.
