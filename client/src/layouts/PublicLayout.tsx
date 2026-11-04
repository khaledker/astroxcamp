import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Starfield } from '../components/Starfield';

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Starfield />

      <a
        href="#main-content"
        className="sr-only z-[100] rounded-sm bg-yellow px-4 py-3 font-display text-sm font-semibold text-space focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main key={location.pathname} id="main-content" className="page-enter flex-1">
        <Outlet />
      </main>
    </div>
  );
}
