export default function MathArt({variant='cover'}) {
  return <div className={`math-art math-art-${variant}`} aria-hidden="true">
    <div className="art-edition">CADERNO DE MEMÓRIAS <span>01 — 04</span></div>
    <div className="art-drawing">
      <svg viewBox="0 0 400 400" fill="none"><defs><linearGradient id={`math-gradient-${variant}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#15834c"/><stop offset="1" stopColor="#8850ba"/></linearGradient></defs><circle cx="200" cy="200" r="151" stroke="#d4bb74" strokeWidth="1"/><circle cx="200" cy="200" r="119" stroke="#bda77a" strokeDasharray="2 8"/><path d="M68 276 200 48 332 276Z" stroke={`url(#math-gradient-${variant})`} strokeWidth="1.7"/><path d="M68 124 332 124 200 352Z" stroke="#a089bd" strokeWidth="1"/><path d="M49 200H351M200 49V351" stroke="#b4ad91" strokeDasharray="4 6"/><ellipse cx="200" cy="200" rx="151" ry="57" transform="rotate(-32 200 200)" stroke="#299762" strokeWidth="1"/><circle cx="200" cy="48" r="6" fill="#edbd3a"/><circle cx="68" cy="276" r="6" fill="#278352"/><circle cx="332" cy="276" r="6" fill="#bc719e"/><circle cx="200" cy="200" r="35" fill="#fffbef" stroke="#d6c49d"/><text x="200" y="215" textAnchor="middle" fill="#20834d" fontFamily="Georgia,serif" fontSize="50">∞</text></svg>
      <span className="art-equation equation-one">a² + b² = c²</span><span className="art-equation equation-two">A = πr²</span>
    </div>
    <div className="art-signature">{variant==='end'?'Conhecimento que se multiplica.':variant==='credits'?'Uma construção coletiva.':'Entre números, histórias.'}</div>
    <div className="art-caption">ENCONTROS · DESCOBERTAS · CONEXÕES</div>
    <div className="art-colors"><i/><i/><i/><i/></div>
  </div>;
}
