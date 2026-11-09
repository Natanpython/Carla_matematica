export default function Geometry({ className = '' }) {
  return <div className={`geometry ${className}`} aria-hidden="true">
    <div className="solid-cube"><i/><i/><i/><i/><i/><i/></div>
    <div className="solid-sphere"/>
    <div className="solid-ring"/>
    <svg className="solid-prism" viewBox="0 0 120 130"><path d="M60 5 8 102 60 126Z" fill="#f9ac06"/><path d="m60 5 52 97-52 24Z" fill="#ffcf24"/><path d="m8 102 52-27 52 27-52 24Z" fill="#e77b00"/></svg>
    <span className="math-symbol math-pi">π</span><span className="math-symbol math-plus">+</span>
    <span className="floating-formula formula-area">A = πr²</span>
    <span className="floating-formula formula-triangle">a² + b² = c²</span>
    <svg className="geometry-orbit" viewBox="0 0 240 180" fill="none"><ellipse cx="120" cy="90" rx="100" ry="35" stroke="currentColor" transform="rotate(-25 120 90)"/><ellipse cx="120" cy="90" rx="100" ry="35" stroke="currentColor" transform="rotate(25 120 90)"/><circle cx="120" cy="90" r="65" stroke="currentColor" strokeDasharray="2 6"/><circle cx="50" cy="58" r="4" fill="currentColor"/><path d="M110 90h20m-10-10v20" stroke="currentColor"/></svg>
  </div>;
}
