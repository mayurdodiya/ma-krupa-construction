import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/common/FloatingActions';
import { Cursor } from '@/components/common/Cursor';
import Home from '@/pages/Home';

// Home ships in the main bundle (it is the landing page); the rest split out.
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Products = lazy(() => import('@/pages/Products'));
const Calculators = lazy(() => import('@/pages/Calculators'));
const BookMeeting = lazy(() => import('@/pages/BookMeeting'));
const Rera = lazy(() => import('@/pages/Rera'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** Router keeps scroll position across navigations; marketing pages start at the top. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600 dark:border-ink-700" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/book-meeting" element={<BookMeeting />} />
                <Route path="/rera" element={<Rera />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingActions />
          {/* Self-disables on touch/coarse pointers and for reduced motion. */}
          <Cursor />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
