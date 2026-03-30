import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Ray Panganiban Technology - Car Rental & Sales",
  description: "Your trusted platform for car sales, rentals, and installment purchases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
