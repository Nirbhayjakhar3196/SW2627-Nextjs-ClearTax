import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Search", className = "" }) {
  return (
    <div
      className={`inline-flex min-h-[3rem] items-center gap-2 rounded-full border border-[rgba(30,64,97,0.12)] bg-white/78 px-4 font-sans text-sm text-stone-500 ${className}`}
    >
      <Search className="h-4 w-4" />
      <span>{placeholder}</span>
    </div>
  );
}
