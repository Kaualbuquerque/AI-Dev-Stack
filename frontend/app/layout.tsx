import "./globals.css";
import type { Metadata } from "next";
import TanstackProvider from "./providers/TanstackProvider";
import { Geist } from "next/font/google";
import { cn } from "./lib/utils";
import ClientLayout from "./components/ui/ClientLayout";
import { UserProvider } from "./lib/UserContext";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "AI-Dev Stack",
  description: "A curated directory of AI tools for developers",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-[#0F172A] text-white">
        <TanstackProvider>
          <UserProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </UserProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}