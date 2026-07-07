import { BellRing } from "lucide-react";

import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { getNotifications } from "../../services/notifications.service";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="app-page page-shell--split">
      <Navbar />
      <div className="page-shell">
        <section className="content-card">
          <div className="flex items-center gap-4">
            <div className="feature-icon">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow">Notifications</p>
              <h1 className="section-title">Activity feed</h1>
            </div>
          </div>

          <div className="mt-6 stack-list">
            {notifications.map((item) => (
              <article key={item.id} className="list-item-card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-base font-semibold text-stone-950">{item.title}</h2>
                    <p className="mt-2 font-sans text-sm leading-7 text-stone-600">{item.detail}</p>
                    <p className="mt-2 font-sans text-xs uppercase tracking-[0.16em] text-stone-400">{item.time}</p>
                  </div>
                  {item.unread ? (
                    <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                      Unread
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                      Read
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
