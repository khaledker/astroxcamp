import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Starfield } from '../components/Starfield';
import { ApiError, getAdminSession, getErrorMessage } from '../lib/api';

interface AdminGuardProps {
  children: ReactNode;
}

type GuardStatus = 'checking' | 'ready' | 'error';

export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<GuardStatus>('checking');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus('checking');
    setError(null);

    getAdminSession()
      .then(() => {
        if (active) setStatus('ready');
      })
      .catch((caught: unknown) => {
        if (!active) return;
        if (caught instanceof ApiError && caught.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setError(getErrorMessage(caught));
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [attempt, navigate]);

  if (status === 'ready') {
    return <>{children}</>;
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-6">
      <Starfield />
      <main className="flex max-w-sm flex-col items-center gap-4 text-center">
        {status === 'checking' ? (
          <>
            <span
              className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent"
              aria-hidden="true"
            />
            <p className="font-mono text-label uppercase text-steel" role="status">
              Verifying session…
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow text-danger">Admin / Connection error</p>
            <p className="font-body text-body text-steel">
              {error ?? 'We could not verify your session.'}
            </p>
            <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
              Try again
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
