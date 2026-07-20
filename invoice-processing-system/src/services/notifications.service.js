const notifications = [
  {
    id: "note-1",
    title: "Northwind batch needs review",
    detail: "6 invoices need GST confirmation before posting can continue.",
    unread: true,
    time: "5 min ago",
  },
  {
    id: "note-2",
    title: "Weekly processing report ready",
    detail: "The weekly summary export is available for download and sharing.",
    unread: true,
    time: "22 min ago",
  },
  {
    id: "note-3",
    title: "Aster reconciliation completed",
    detail: "132 invoices were posted successfully with no duplicate conflicts.",
    unread: false,
    time: "1 hour ago",
  },
];

export async function getNotifications() {
  return notifications;
}
