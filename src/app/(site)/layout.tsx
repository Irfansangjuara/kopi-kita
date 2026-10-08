import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AnalyticsProvider from '@/components/posthog-provider';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </AnalyticsProvider>
  );
}