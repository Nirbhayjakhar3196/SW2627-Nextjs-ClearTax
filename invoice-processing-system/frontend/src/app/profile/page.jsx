import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import DashboardShell from "../../components/layout/DashboardShell";
import PageHeader from "../../components/common/PageHeader";
import { profile } from "../../lib/mock-data";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="app-page page-shell--warm">
        <div className="page-shell">
        <PageHeader
          eyebrow="Profile"
          title="Keep ownership details current for review, approvals, and escalations."
          description="The profile page holds the primary contact details and team context used across batch assignments and reporting workflows."
          metrics={[
            { label: "Team", value: profile.team },
            { label: "Location", value: profile.location },
            { label: "Open Reviews", value: "6", accent: true },
            { label: "Weekly Exports", value: "9" },
          ]}
        />

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="content-card">
            <p className="section-eyebrow">Current Role</p>
            <h2 className="section-title">{profile.name}</h2>
            <p className="section-copy">{profile.bio}</p>
          </article>

          <article className="content-card">
            <p className="section-eyebrow">Edit Details</p>
            <h2 className="section-title">Profile information</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Input label="Full name" defaultValue={profile.name} />
              <Input label="Role" defaultValue={profile.role} />
              <Input label="Email" defaultValue={profile.email} />
              <Input label="Phone" defaultValue={profile.phone} />
              <Input label="Team" defaultValue={profile.team} />
              <Input label="Location" defaultValue={profile.location} />
            </div>
            <div className="action-row">
              <Button>Save changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </article>
        </section>
        </div>
      </div>
    </DashboardShell>
  );
}
