import type { Metadata } from "next";
import "./globals.css";
import { EventProvider } from "@/context/EventContext";

export const metadata: Metadata = {
  title: "Eventora AI — Plan Smarter. Celebrate Better.",
  description: "Intelligent Generative AI-Powered Celebration & Event Planning Copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#FFFDF9] text-[#25212A]">
        <EventProvider>
          {children}
        </EventProvider>
      </body>
    </html>
  );
}
