export default function Modal({ title, children }) {
  return (
    <div className="content-card">
      <div className="panel-header">
        <div>
          <p className="section-eyebrow">Modal Preview</p>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
