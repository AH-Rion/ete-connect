import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgress, BackToTop } from './ScrollElements';

export const Layout = () => (
  <>
    <ScrollProgress />
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
    <BackToTop />
  </>
);
