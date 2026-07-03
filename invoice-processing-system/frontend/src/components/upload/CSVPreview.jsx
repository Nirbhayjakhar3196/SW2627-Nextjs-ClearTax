const statusTone = {
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  Mapped: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function CSVPreview({ rows = [] }) {
  return (
    <section className="rounded-[28px] border border-[rgba(86,67,43,0.14)] bg-white/80 p-6 shadow-[0_18px_40px_rgba(58,40,23,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e4b22]">
            CSV Preview
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            Parsed rows before import
          </h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">
            Review a sample of parsed invoice rows so date, amount, and vendor
            mapping issues can be caught before batch submission.
          </p>
        </div>

        <div className="flex gap-3 text-sm">
          <div className="rounded-2xl border border-[rgba(86,67,43,0.12)] bg-[rgba(255,250,243,0.72)] px-4 py-3">
            <p className="text-stone-500">Rows detected</p>
            <p className="mt-1 text-2xl font-semibold text-stone-950">418</p>
          </div>
          <div className="rounded-2xl border border-[rgba(86,67,43,0.12)] bg-[rgba(255,250,243,0.72)] px-4 py-3">
            <p className="text-stone-500">Issues found</p>
            <p className="mt-1 text-2xl font-semibold text-[#c7632f]">11</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(86,67,43,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[rgba(255,250,243,0.84)] text-left text-xs uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-4 py-4 font-semibold">Invoice ID</th>
                <th className="px-4 py-4 font-semibold">Vendor</th>
                <th className="px-4 py-4 font-semibold">Invoice Date</th>
                <th className="px-4 py-4 font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row) => (
                <tr
                  key={row.invoiceId}
                  className="border-t border-[rgba(86,67,43,0.08)] text-sm text-stone-700"
                >
                  <td className="px-4 py-4 font-semibold text-stone-950">
                    {row.invoiceId}
                  </td>
                  <td className="px-4 py-4">{row.vendor}</td>
                  <td className="px-4 py-4">{row.invoiceDate}</td>
                  <td className="px-4 py-4">{row.amount}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        statusTone[row.status] || statusTone.Ready
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
