export default function UploadCard({ title, value, description }) {
  return (
    <article className="surface-panel surface-panel--soft p-5">
      <p className="font-sans text-sm text-stone-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
        {value}
      </p>
      <p className="mt-2 font-sans text-sm leading-7 text-stone-500">{description}</p>
    </article>
  );
}
