import Button from "../../components/common/Button";
import DashboardShell from "../../components/layout/DashboardShell";
import PageHeader from "../../components/common/PageHeader";
import { settingsGroups } from "../../lib/mock-data";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="app-page page-shell--split">
        <div className="page-shell">
        <PageHeader
          eyebrow="Settings"
          title="Tune notifications, upload rules, and ops defaults without leaving the workspace."
          description="These settings control alert timing, file validation strictness, and the defaults that keep the queue predictable."
          metrics={[
            { label: "Active Rules", value: "18" },
            { label: "Strict Checks", value: "On", accent: true },
            { label: "Daily Emails", value: "Enabled" },
            { label: "Escalations", value: "Immediate" },
          ]}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          {settingsGroups.map((group) => (
            <article key={group.title} className="content-card">
              <p className="section-eyebrow">{group.title}</p>
              <h2 className="section-title">Configuration</h2>
              <div className="mt-6 stack-list">
                {group.items.map((item) => (
                  <div key={item.label} className="list-item-card">
                    <p className="font-sans text-sm text-stone-500">{item.label}</p>
                    <p className="mt-2 font-sans text-base font-semibold text-stone-950">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <div className="action-row">
          <Button>Save preferences</Button>
          <Button variant="secondary">Reset defaults</Button>
        </div>
        </div>
      </div>
    </DashboardShell>
  );
}
