import InvoiceRow from "./InvoiceRow";

export default function InvoiceTable({ invoices }) {
  return (
    <section className="content-card">
      <div className="panel-header">
        <div>
          <p className="section-eyebrow">Invoice Register</p>
          <h2 className="section-title">Latest invoice records</h2>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(30,64,97,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[rgba(240,248,255,0.92)] text-left text-xs uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-4 py-4 font-semibold">Invoice</th>
                <th className="px-4 py-4 font-semibold">Vendor</th>
                <th className="px-4 py-4 font-semibold">Customer</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Match</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
