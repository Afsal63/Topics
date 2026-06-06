import "./globals.css";

export const metadata = {
  title: "Interview Guides",
  description: "Reusable Next.js interview guides migrated from static HTML pages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
