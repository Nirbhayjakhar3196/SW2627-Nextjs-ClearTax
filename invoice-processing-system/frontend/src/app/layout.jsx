import "./globals.css";

export const metadata = {
  title: "ClearTax Invoice Processing",
  description: "The invoice processing system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-shell">{children}</body>
    </html>
  );
}
