import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell__body">
        <Sidebar />
        <main className="dashboard-shell__main">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
