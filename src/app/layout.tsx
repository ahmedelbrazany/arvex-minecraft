import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/topBar";
import ContentWrapper from "@/components/ContentWrapper";
import Providers from "@/components/Providers";
import LoadingState from "@/components/LoadingState";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arvex",
  description: "Welcome to Arvex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <LoadingState>
            <div className="parallax-bg">
              <div
                className="particle"
                style={{
                  top: "10%",
                  left: "5%",
                  width: "150px",
                  height: "150px",
                  opacity: 0.05,
                }}
              ></div>
              <div
                className="particle"
                style={{
                  top: "30%",
                  left: "25%",
                  width: "200px",
                  height: "200px",
                  opacity: 0.03,
                }}
              ></div>
              <div
                className="particle"
                style={{
                  top: "60%",
                  left: "70%",
                  width: "180px",
                  height: "180px",
                  opacity: 0.04,
                }}
              ></div>
              <div
                className="particle"
                style={{
                  top: "75%",
                  left: "15%",
                  width: "120px",
                  height: "120px",
                  opacity: 0.03,
                }}
              ></div>
              <div
                className="particle"
                style={{
                  top: "20%",
                  left: "85%",
                  width: "100px",
                  height: "100px",
                  opacity: 0.05,
                }}
              ></div>
              <div className="wave"></div>
            </div>

            <div className="flex min-h-screen">
              <div className="flex-shrink-0">
                <TopBar />
              </div>

              <ContentWrapper>{children}</ContentWrapper>
            </div>
          </LoadingState>
        </Providers>
      </body>
    </html>
  );
}
