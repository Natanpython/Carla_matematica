'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Geometry from './Geometry';
import { Expand } from 'lucide-react';
const HighlightContext=createContext(null);

function Photograph({photo,label}) {
  const highlight=useContext(HighlightContext);
  const [shape,setShape]=useState(null);
  const ratio=shape?.src===photo.src?shape.ratio:0;
  return <figure className="album-photograph" data-photo={photo.src}>
    <div className={`photo-mount ${ratio>1?'landscape-mount':''}`} style={ratio>1?{'--photo-ratio':ratio}:undefined}>
      <span className="photo-tape"/>
      <img src={photo.src} onLoad={e=>setShape({src:photo.src,ratio:e.currentTarget.naturalWidth/e.currentTarget.naturalHeight})} alt={`${label} — registro ${photo.number}`}/>
      <span className="photo-corner corner-tl"/><span className="photo-corner corner-br"/>
      <button className="photo-enlarge" aria-label={`Destacar memória ${photo.number}`} onClick={event=>highlight?.({src:photo.src,alt:`${label} — registro ${photo.number}`},event)}><Expand size={17}/><span>Olhar de perto</span></button>
    </div>
    <figcaption><span>MEMÓRIA {String(photo.number).padStart(2,'0')}</span><i>•</i></figcaption>
  </figure>;
}

function Page({slide,index,side}) {
  const highlight=useContext(HighlightContext);
  const photos=side==='left'?slide.leftPhotos:slide.rightPhotos;
  const [shape,setShape]=useState(null);
  const ratio=shape && shape.src===slide.src?shape.ratio:0;
  return <div className={`paper-page paper-${side} paper-${slide.type}`}>
    {slide.type==='photos'?<>
      <div className="photo-page-heading"><span>{slide.label}</span><span>RECORDAR</span></div>
      <div className={`photo-page-stack ${photos?.length>1?'photo-stack-double':''}`}>
        {photos?.map(photo=><Photograph key={photo.src} photo={photo} label={slide.label}/>)}
      </div>
    </>:side==='left'?<>
      <div className="book-kicker">BAYEUX · MEMÓRIAS DA EDUCAÇÃO</div>
      <div className="book-story"><span className="book-chapter">{slide.chapter?String(slide.chapter).padStart(2,'0'):'✳'}</span><div className="eyebrow">{slide.label}</div><h2>{slide.title}</h2><div className="color-rule"><i/><i/><i/><i/></div>{slide.topic&&<h3 className="chapter-topic">{slide.topic}</h3>}<p>{slide.text}</p>{slide.type==='credits'&&<p className="book-credit">Formadora de Recomposição das Aprendizagens — Matemática e Coordenadora de Matemática dos Anos Finais.<br/><br/>Com os professores do 5º e 6º ano da Rede Municipal de Bayeux.</p>}</div>
    </>:slide.src?<>
      <div className="mobile-story"><strong>{slide.title}</strong><p>{slide.text}</p></div>
      <div className={`photo-mount ${ratio>1?'landscape-mount':''}`} style={ratio>1?{'--photo-ratio':ratio}:undefined}><span className="photo-tape"/><img src={slide.src} onLoad={e=>setShape({src:slide.src,ratio:e.currentTarget.naturalWidth/e.currentTarget.naturalHeight})} alt={slide.alt||`Convite da ${slide.label}`}/><span className="photo-corner corner-tl"/><span className="photo-corner corner-br"/><button className="photo-enlarge" aria-label="Destacar imagem da página" onClick={event=>highlight?.({src:slide.src,alt:slide.alt||slide.label},event)}><Expand size={17}/><span>Olhar de perto</span></button></div><span className="photo-handwriting">{slide.caption||'O convite para esse encontro'}</span>
    </>:<div className="closing-dedication"><span>MEMÓRIAS DA EDUCAÇÃO</span><p>{slide.type==='credits'?'Uma história escrita por muitas mãos.':'O que compartilhamos continua em cada sala de aula.'}</p><div className="color-rule"><i/><i/><i/><i/></div><small>Rede Municipal de Bayeux</small></div>}
    <div className="paper-footer"><span>{side==='left'?'MATEMÁTICA EM FOCO':slide.label}</span><span>{String(index*2+(side==='left'?1:2)).padStart(2,'0')}</span></div>
  </div>;
}

export default function PhotoBook({slides,index,onAdvance,onHighlight}) {
  const previous=useRef(index),[turn,setTurn]=useState(null),touch=useRef(null);
  useEffect(()=>{if(previous.current===index)return;const old=previous.current;previous.current=index;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setTurn(null);return;}setTurn({old,next:index,direction:index>old?'forward':'backward'});const timer=setTimeout(()=>setTurn(null),1050);return()=>clearTimeout(timer);},[index]);
  const slide=slides[index];
  return <HighlightContext.Provider value={onHighlight}><div className="book-stage" onTouchStart={e=>{touch.current={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)onAdvance(dx<0?1:-1);touch.current=null;}}>
    <Geometry className="stage-geometry"/>
    <div className="book-spread" data-type={slide.type} data-direction={turn?.direction||'still'}>
      <div className="book-cover"/><div className="book-ribbon"/>
      <Page slide={slide} index={index} side="left"/><Page slide={slide} index={index} side="right"/>
      <div className="book-binding"/>
      {turn&&<div className={`turn-layer turn-${turn.direction}`} inert={true} key={`${turn.old}-${turn.next}`} aria-hidden="true">
        <div className={`mobile-turn-page mobile-turn-${slides[turn.old].type}`}>{slides[turn.old].type==='photos'&&<Page slide={slides[turn.old]} index={turn.old} side="left"/>}<Page slide={slides[turn.old]} index={turn.old} side={['intro','end','credits'].includes(slides[turn.old].type)?'left':'right'}/></div><div className="stationary-old"><Page slide={slides[turn.old]} index={turn.old} side={turn.direction==='forward'?'left':'right'}/></div>
        <div className="turning-leaf"><div className="leaf-front"><Page slide={slides[turn.old]} index={turn.old} side={turn.direction==='forward'?'right':'left'}/></div><div className="leaf-back"><Page slide={slide} index={index} side={turn.direction==='forward'?'left':'right'}/></div></div>
      </div>}
    </div>
    <div className="book-hint">Um álbum de encontros, descobertas e afeto <span>·</span> Use as setas para virar as páginas</div>
  </div></HighlightContext.Provider>;
}
