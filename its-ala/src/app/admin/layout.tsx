import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Its Ala",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-[#f3f1ec] text-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
