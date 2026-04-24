import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Seafood Market - Buy Online",
  description: "Fresh seafood, fish, shrimp, crab, lobster and more - Direct from the ocean to your table",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}