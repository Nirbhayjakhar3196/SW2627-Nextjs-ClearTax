import SearchBar from "../common/SearchBar";

const filters = ["All invoices", "Matched", "Review", "Processing", "Mismatch"];

export default function InvoiceFilter() {
  return (
    <section className="content-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-eyebrow">Filters</p>
          <h2 className="section-title">Review the queue faster</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <SearchBar placeholder="Search invoice, vendor or job" />
          {filters.map((filter, index) => (
            <span
              key={filter}
              className={`inline-flex min-h-[3rem] items-center rounded-full border px-4 font-sans text-sm font-semibold ${
                index === 0
                  ? "border-transparent bg-[var(--accent)] text-white"
                  : "border-[rgba(86,67,43,0.12)] bg-white/72 text-stone-700"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
