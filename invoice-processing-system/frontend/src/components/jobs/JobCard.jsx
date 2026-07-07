export default function JobCard({ children, className = "" }) {
  return (
    <div className={`content-card ${className}`}>
      {children}
    </div>
  );
}
