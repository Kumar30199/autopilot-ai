export default function Card({ children, className = "", static: isStatic = false, color = null }) {
  // Determine if we should add hover effect based on color variant or just default
  const hoverClass = isStatic ? "" : color ? `card-hover-${color}` : "card-hover";
  
  return (
    <div className={`card ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
