import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flow Desk - Task Manager",
  description: "A modern, aesthetic task management application for seamless productivity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
