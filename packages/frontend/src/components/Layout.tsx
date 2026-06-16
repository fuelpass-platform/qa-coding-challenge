import { Button } from '@heroui/react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <header className="border-b border-default-200 bg-content1/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-fuelpass-500">FuelPass</span>
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">
              Fuel Orders
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`text-sm font-medium ${
                pathname === '/'
                  ? 'text-fuelpass-500'
                  : 'text-[color:var(--text-secondary)]'
              }`}
            >
              Orders
            </Link>
            <Button color="primary" onPress={() => navigate('/orders/new')}>
              New fuel order
            </Button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
