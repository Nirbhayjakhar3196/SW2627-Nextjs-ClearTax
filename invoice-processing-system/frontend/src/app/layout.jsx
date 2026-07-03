import "./globals.css";

export const metadata = {
  title: "ClearTax Invoice Processing",
  description: "Foundation UI for the invoice processing system frontend.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-shell">{children}</body>
    </html>
  );
}
