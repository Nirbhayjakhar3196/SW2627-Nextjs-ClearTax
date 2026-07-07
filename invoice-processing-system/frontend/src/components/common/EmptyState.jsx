import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing to show",
  message = "Once data is available, it will appear here.",
}) {
  return (
    <div className="content-card flex min-h-[240px] flex-col items-center justify-center text-center">
      <div className="feature-icon">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 max-w-md font-sans text-sm leading-7 text-stone-500">
        {message}
      </p>
    </div>
  );
}
