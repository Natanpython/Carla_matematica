import { chapters, introduction } from './content';

// Every source photograph belongs to one spread only. The last three photos
// share a spread when a chapter has an odd number of records.
function photoSpreads(chapter) {
  const result=[];
  for(let i=0;i<chapter.photos.length;) {
    const count=chapter.photos.length-i===3?3:2;
    const photos=chapter.photos.slice(i,i+count).map((photo,j)=>({...photo,number:i+j+1}));
    result.push({type:'photos',chapter:chapter.id,label:`${chapter.id}ª formação · ${chapter.month}`,leftPhotos:photos.slice(0,1),rightPhotos:photos.slice(1)});
    i+=count;
  }
  return result;
}

export const slides = [
  {type:'opening',title:'Matemática em foco',text:'Recomposição e transição para as turmas do 5º e 6º ano do Ensino Fundamental',label:'Uma jornada de aprendizagem',src:'/media/abertura-materiais.jpeg',alt:'Livros, jogos e materiais pedagógicos de Matemática',caption:'Possibilidades para ensinar e aprender'},
  {type:'opening',title:'Cada encontro, uma nova possibilidade.',text:introduction,label:'Apresentação',src:'/media/abertura-encontros.jpeg',alt:'Montagem de momentos compartilhados nas formações',caption:'Encontros que ficam na memória'},
  ...chapters.flatMap(c=>[
    {type:'card',src:c.card,title:c.title,text:c.text,topic:c.topic,label:`${c.id}ª formação · ${c.month}`,chapter:c.id},
    ...photoSpreads(c)
  ]),
  {type:'end',title:'O aprendizado continua.',text:'A cada troca, uma possibilidade. A cada encontro, mais caminhos para ensinar e aprender. Obrigado a todos os educadores que fazem parte desta história.',label:'Uma história construída juntos',ornament:'end'},
  {type:'credits',title:'Quem faz acontecer',text:'Carla Cristina Rodrigues do Nascimento',label:'Secretaria Municipal de Educação de Bayeux',ornament:'credits'}
];

export function sourcesForSpread(slide) {
  return slide.src?[slide.src]:[...(slide.leftPhotos||[]),...(slide.rightPhotos||[])].map(p=>p.src);
}
