import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/store/provider";
import { UserRoleRenderer } from "@/func/render-rol";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "tailwindcss/tailwind.css";
import NavBar from "@/components/ui/nav-barr";
import DynamicAlert from "@/components/func/dynamic-alert";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ user, admin, dev, children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="system"
          >
            <NavBar />
            <UserRoleRenderer
              user={user}
              admin={admin}
              dev={dev}
              fallback={children}
            />
            <SpeedInsights />
            <DynamicAlert />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
