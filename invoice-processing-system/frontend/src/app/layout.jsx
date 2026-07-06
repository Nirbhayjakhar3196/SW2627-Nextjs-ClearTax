import "./globals.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export const metadata = {
  title: "ClearTax Invoice Processing",
  description: "Foundation UI for the invoice processing system frontend.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-shell">
        <div className="root-layout">
          <Navbar />
          <div className="root-layout__body">
            <Sidebar />
            <main className="root-layout__main">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
