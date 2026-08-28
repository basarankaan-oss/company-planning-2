import "./globals.css";
export const metadata = { title: "Company Planning", description: "Çalışan vardiya planlama sistemi" };
export default function RootLayout({ children }) {
  return <html lang="tr"><body>{children}</body></html>;
}