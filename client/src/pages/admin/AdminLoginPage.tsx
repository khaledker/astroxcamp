import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AssetPlaceholder } from '../../components/AssetPlaceholder';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Starfield } from '../../components/Starfield';
import { adminLogin, getAdminSession, getErrorMessage } from '../../lib/api';
import { adminLoginFormSchema } from '../../lib/admin-schema';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function AdminLoginPage() {
  useDocumentTitle('Admin sign in — AstroXcamp 26/27');
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If a valid httpOnly cookie already exists, skip the form.
  useEffect(() => {
    let active = true;
    getAdminSession()
      .then(() => {
        if (active) navigate('/admin', { replace: true });
      })
      .catch(() => {
        // 401 is expected for signed-out visitors; the form stays visible.
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = adminLoginFormSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'email' && !nextErrors.email) nextErrors.email = issue.message;
        if (key === 'password' && !nextErrors.password) nextErrors.password = issue.message;
      }
      setFieldErrors(nextErrors);
      window.setTimeout(() => {
        formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
      }, 0);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await adminLogin(parsed.data.email, parsed.data.password);
      navigate('/admin', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
      setPassword('');
      window.setTimeout(() => {
        document.getElementById('admin-password')?.focus();
      }, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <Starfield />

      <header className="site-container flex min-h-20 items-center justify-between gap-4 py-5">
        <Link to="/" aria-label="AstroXcamp home" className="inline-flex min-h-11 items-center">
          <AssetPlaceholder
            asset="logo"
            variant="inline"
            className="h-8 w-[6.5rem] md:h-9 md:w-[9.375rem]"
          />
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center font-mono text-2xs uppercase tracking-[0.12em] text-steel transition-colors hover:text-yellow"
        >
          ← Back to site
        </Link>
      </header>

      <main className="page-enter flex flex-1 items-center justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-[28rem]">
          <p className="eyebrow text-center">Admin / Mission control</p>
          <Card className="mt-5 w-full">
            <h1 className="font-display text-display-sm">Sign in</h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-steel">
              Restricted console for AstroXcamp registrations.
            </p>

            <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
              {formError && (
                <div
                  role="alert"
                  className="rounded-sm border border-danger/50 bg-danger/5 px-4 py-3 font-body text-sm text-danger"
                >
                  {formError}
                </div>
              )}

              <Input
                id="admin-email"
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                spellCheck={false}
                placeholder="admin@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((previous) => ({ ...previous, email: undefined }));
                }}
                error={fieldErrors.email}
                required
              />

              <Input
                id="admin-password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((previous) => ({ ...previous, password: undefined }));
                }}
                error={fieldErrors.password}
                required
              />

              <Button type="submit" isLoading={isSubmitting} className="w-full">
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>

          <p className="mt-5 text-center font-mono text-2xs uppercase tracking-[0.1em] text-muted">
            Authorised organisers only
          </p>
        </div>
      </main>
    </div>
  );
}
