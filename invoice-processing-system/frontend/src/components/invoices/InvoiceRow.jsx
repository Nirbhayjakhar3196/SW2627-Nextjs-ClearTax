import Link from "next/link";

import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function InvoiceRow({ invoice }) {
  return (
    <tr className="border-t border-[rgba(30,64,97,0.08)] font-sans text-sm text-stone-700">
      <td className="px-4 py-4 font-semibold text-stone-950">
        <Link href={`/invoices/${invoice.id}`} className="hover:text-[var(--accent)]">
          {invoice.id}
        </Link>
      </td>
      <td className="px-4 py-4">{invoice.vendor}</td>
      <td className="px-4 py-4">{invoice.customer}</td>
      <td className="px-4 py-4">{formatDate(invoice.date)}</td>
      <td className="px-4 py-4">{formatCurrency(invoice.amount)}</td>
      <td className="px-4 py-4">{invoice.matchScore}</td>
      <td className="px-4 py-4">
        <StatusBadge status={invoice.status} />
      </td>
    </tr>
  );
}
