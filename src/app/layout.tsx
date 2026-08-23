import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LocationPermissionModal } from "@/components/trip/location-permission-modal";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { InitialLoader } from "@/components/ui/initial-loader"; // 1. Import InitialLoader

export const metadata: Metadata = {
  title: "YatraSetu — Unified Tourism Discovery & Travel Intelligence",
  description:
    "AI-assisted destination ranking, vehicle-aware route intelligence, nearby emergency services, and community travel hub for India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 antialiased"
    >
      <body className="flex min-h-full flex-col font-sans transition-colors duration-200">
        {/* 2. Wrap everything inside the body with ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* 3. Wrap contents with InitialLoader */}
            <InitialLoader>
              <Navbar />
              {/* Dynamic background that adapts cleanly to both light and dark modes */}
              <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 relative overflow-hidden">
                {/* Subtle ambient glow that only appears in dark mode */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

                <div className="relative z-10">{children}</div>
              </main>
              <Footer />
              <LocationPermissionModal />
            </InitialLoader>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import "./globals.css";
// import { AuthProvider } from "@/lib/auth/auth-context";
// import { Navbar } from "@/components/layout/navbar";
// import { Footer } from "@/components/layout/footer";
// import { LocationPermissionModal } from "@/components/trip/location-permission-modal";
// import { ThemeProvider } from "@/components/ui/theme-provider";

// export const metadata: Metadata = {
//   title: "YatraSetu — Unified Tourism Discovery & Travel Intelligence",
//   description:
//     "AI-assisted destination ranking, vehicle-aware route intelligence, nearby emergency services, and community travel hub for India.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className="h-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 antialiased"
//     >
//       <body className="flex min-h-full flex-col font-sans transition-colors duration-200">
//         {/* 2. Wrap everything inside the body with ThemeProvider */}
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <AuthProvider>
//             <Navbar />
//             {/* Dynamic background that adapts cleanly to both light and dark modes */}
//             <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 relative overflow-hidden">
//               {/* Subtle ambient glow that only appears in dark mode */}
//               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

//               <div className="relative z-10">{children}</div>
//             </main>
//             <Footer />
//             <LocationPermissionModal />
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
