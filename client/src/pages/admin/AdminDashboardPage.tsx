import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AssetPlaceholder } from '../../components/AssetPlaceholder';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Starfield } from '../../components/Starfield';
import {
  adminLogout,
  ApiError,
  deleteRegistration,
  downloadRegistrationsCsv,
  getErrorMessage,
  getRegistrations,
  type AdminSortField,
  type AdminSortOrder,
  type ApiRegistration,
  type RegistrationsResponse,
} from '../../lib/api';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const PAGE_SIZE = 10;
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 4.25h11M6.25 4.25V2.5h3.5v1.75M4 4.25l.6 9.25h6.8L12 4.25M6.5 7v4M9.5 7v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SortHeaderProps {
  field: AdminSortField;
  label: string;
  currentSort: AdminSortField;
  currentOrder: AdminSortOrder;
  onSort: (field: AdminSortField) => void;
}

function SortHeader({ field, label, currentSort, currentOrder, onSort }: SortHeaderProps) {
  const active = currentSort === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="flex min-h-11 w-full items-center gap-2 text-left font-mono text-2xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-star"
      aria-label={`Sort by ${label}${active ? `, currently ${currentOrder === 'asc' ? 'ascending' : 'descending'}` : ''}`}
    >
      {label}
      <span aria-hidden="true" className={active ? 'text-yellow' : 'text-line-strong'}>
        {active ? (currentOrder === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  );
}

export function AdminDashboardPage() {
  useDocumentTitle('Registrations — AstroXcamp admin');
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<AdminSortField>('createdAt');
  const [order, setOrder] = useState<AdminSortOrder>('desc');
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<RegistrationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ApiRegistration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setIsLoading(true);
    setError(null);

    getRegistrations({
      search,
      page,
      pageSize: PAGE_SIZE,
      sort,
      order,
      signal: controller.signal,
    })
      .then((response) => {
        if (!active) return;
        setData(response);
        setIsLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        if (caught instanceof DOMException && caught.name === 'AbortError') return;

        if (caught instanceof ApiError && caught.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }

        setError(getErrorMessage(caught));
        setIsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [search, page, sort, order, refreshKey, navigate]);

  useEffect(() => {
    if (!deleteTarget) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    cancelDeleteRef.current?.focus();

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDeleteTarget(null);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        deleteDialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [deleteTarget]);

  const handleSort = (field: AdminSortField) => {
    setPage(1);
    if (field === sort) {
      setOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(field);
      setOrder(field === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteRegistration(deleteTarget.id);
      setDeleteTarget(null);
      if (data && data.data.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setDeleteError(getErrorMessage(caught));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActionError(null);

    try {
      const blob = await downloadRegistrationsCsv();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'astroxcamp-26-27-registrations.csv';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setActionError(getErrorMessage(caught));
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setActionError(null);
    try {
      await adminLogout();
      navigate('/admin/login', { replace: true });
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const totalRegistrations = data?.totalRegistrations;
  const rows = data?.data ?? [];
  const pagination = data?.pagination;
  const showSkeleton = isLoading && !data;
  const showEmpty = !isLoading && !error && data !== null && rows.length === 0;

  return (
    <div className="relative isolate min-h-screen">
      <Starfield />

      <header className="sticky top-0 z-40 border-b border-line/80 bg-space/95 backdrop-blur-md">
        <div className="site-container flex min-h-20 flex-wrap items-center gap-4 py-3">
          <Link to="/" aria-label="AstroXcamp home" className="inline-flex min-h-11 shrink-0 items-center">
            <AssetPlaceholder
              asset="logo"
              variant="inline"
              className="h-8 w-[6.5rem] md:h-9 md:w-[9.375rem]"
            />
          </Link>
          <span className="hidden font-mono text-2xs uppercase tracking-[0.14em] text-muted md:inline">
            Admin / Mission control
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="flex min-h-11 items-center rounded-sm px-3 font-body text-sm text-steel transition-colors hover:text-yellow"
            >
              View site
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="site-container page-enter py-10 md:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin / 01</p>
            <h1 className="mt-3 text-display-lg">Registrations</h1>
            <p className="mt-3 max-w-xl font-body text-body text-steel">
              Search, sort, export or remove AstroXcamp signups. This data is private.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="secondary"
              onClick={handleExport}
              isLoading={isExporting}
              disabled={totalRegistrations === 0}
              className="w-full sm:w-auto"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-6 rounded-sm border border-danger/50 bg-danger/5 px-4 py-3 font-body text-sm text-danger"
          >
            {actionError}
          </div>
        )}

        <Card tone="subtle" className="mt-8 flex w-full flex-col gap-2 p-6 sm:max-w-xs">
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-muted">
            Total registrations
          </p>
          <p
            className="font-display text-display-md text-yellow"
            aria-live="polite"
            aria-label={
              totalRegistrations === undefined
                ? 'Loading total'
                : `${totalRegistrations} total registrations`
            }
          >
            {totalRegistrations ?? '—'}
          </p>
        </Card>

        <Card className="mt-6 overflow-hidden" padded={false}>
          <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-end md:justify-between">
            <Input
              label="Search registrations"
              hideLabel
              type="search"
              name="search"
              placeholder="Search name, email or school"
              value={searchInput}
              onChange={(event) => handleSearch(event.target.value)}
              className="w-full md:max-w-md"
              autoComplete="off"
            />

            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-2 lg:hidden">
                <span className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                  Sort by
                </span>
                <select
                  value={`${sort}:${order}`}
                  onChange={(event) => {
                    const [nextSort, nextOrder] = event.target.value.split(':') as [
                      AdminSortField,
                      AdminSortOrder,
                    ];
                    setSort(nextSort);
                    setOrder(nextOrder);
                    setPage(1);
                  }}
                  className="h-12 rounded-sm border border-line-strong bg-surface px-3 font-body text-sm text-star transition-colors focus:border-blue focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <option value="createdAt:desc">Newest first</option>
                  <option value="createdAt:asc">Oldest first</option>
                  <option value="fullName:asc">Name A–Z</option>
                  <option value="fullName:desc">Name Z–A</option>
                  <option value="email:asc">Email A–Z</option>
                  <option value="email:desc">Email Z–A</option>
                  <option value="school:asc">School A–Z</option>
                  <option value="school:desc">School Z–A</option>
                </select>
              </label>

              {pagination && (
                <p className="font-mono text-2xs uppercase tracking-[0.1em] text-muted">
                  {pagination.total} matching
                  {search ? ` “${search}”` : ''}
                </p>
              )}
            </div>
          </div>

          {isLoading && data && (
            <div className="h-0.5 w-full overflow-hidden bg-line" aria-hidden="true">
              <div className="h-full w-1/3 animate-pulse bg-blue" />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 border-b border-danger/30 bg-danger/5 px-5 py-4 font-body text-sm text-danger sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{error}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRefreshKey((current) => current + 1)}
              >
                Retry
              </Button>
            </div>
          )}

          {showSkeleton && (
            <div className="flex flex-col gap-3 p-5" aria-busy="true">
              <span className="sr-only" role="status">
                Loading registrations
              </span>
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-sm bg-elevated" />
              ))}
            </div>
          )}

          {showEmpty && (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-lg text-star">No registrations found</p>
              <p className="mt-2 font-body text-sm text-steel">
                {search
                  ? `Nothing matches “${search}”. Try a different search.`
                  : 'New signups will appear here.'}
              </p>
              {search && (
                <Button variant="secondary" size="sm" className="mt-6" onClick={clearSearch}>
                  Clear search
                </Button>
              )}
            </div>
          )}

          {!showSkeleton && rows.length > 0 && (
            <>
              <div className={`hidden lg:block ${isLoading ? 'opacity-60' : ''}`}>
                <table className="admin-table w-full table-fixed border-collapse">
                  <caption className="sr-only">
                    AstroXcamp registrations, page {pagination?.page ?? 1} of{' '}
                    {pagination?.totalPages ?? 1}
                  </caption>
                  <thead>
                    <tr className="bg-elevated/60">
                      <th
                        scope="col"
                        className="w-[16%] px-4 py-2 text-left"
                        aria-sort={
                          sort === 'fullName'
                            ? order === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <SortHeader
                          field="fullName"
                          label="Name"
                          currentSort={sort}
                          currentOrder={order}
                          onSort={handleSort}
                        />
                      </th>
                      <th
                        scope="col"
                        className="w-[22%] px-4 py-2 text-left"
                        aria-sort={
                          sort === 'email'
                            ? order === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <SortHeader
                          field="email"
                          label="Email"
                          currentSort={sort}
                          currentOrder={order}
                          onSort={handleSort}
                        />
                      </th>
                      <th scope="col" className="w-[12%] px-4 py-2 text-left">
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="w-[17%] px-4 py-2 text-left"
                        aria-sort={
                          sort === 'school'
                            ? order === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <SortHeader
                          field="school"
                          label="School"
                          currentSort={sort}
                          currentOrder={order}
                          onSort={handleSort}
                        />
                      </th>
                      <th scope="col" className="w-[11%] px-4 py-2 text-left">
                        Other
                      </th>
                      <th
                        scope="col"
                        className="w-[13%] px-4 py-2 text-left"
                        aria-sort={
                          sort === 'createdAt'
                            ? order === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        <SortHeader
                          field="createdAt"
                          label="Registered"
                          currentSort={sort}
                          currentOrder={order}
                          onSort={handleSort}
                        />
                      </th>
                      <th scope="col" className="w-[9%] px-4 py-2 text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-4 py-4">
                          <span
                            className="block truncate font-medium text-star"
                            title={registration.fullName}
                          >
                            {registration.fullName}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="block truncate" title={registration.email}>
                            {registration.email}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="block truncate" title={registration.phone}>
                            {registration.phone}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="block truncate" title={registration.school}>
                            {registration.school}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="block truncate"
                            title={registration.other ?? undefined}
                          >
                            {registration.other || '—'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs">
                          {formatDate(registration.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="danger"
                            size="sm"
                            aria-label={`Delete registration for ${registration.fullName}`}
                            onClick={() => {
                              setDeleteError(null);
                              setDeleteTarget(registration);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul
                className={`divide-y divide-line/70 lg:hidden ${isLoading ? 'opacity-60' : ''}`}
                aria-label="Registrations"
              >
                {rows.map((registration) => (
                  <li key={registration.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold text-star">
                          {registration.fullName}
                        </p>
                        <p className="mt-1 break-all font-body text-sm text-blue">
                          {registration.email}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="icon"
                        aria-label={`Delete registration for ${registration.fullName}`}
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(registration);
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      <div className="min-w-0">
                        <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                          Phone
                        </dt>
                        <dd className="mt-1 break-words font-body text-sm text-steel">
                          {registration.phone}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                          Registered
                        </dt>
                        <dd className="mt-1 font-body text-sm text-steel">
                          {formatDate(registration.createdAt)}
                        </dd>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                          University or school
                        </dt>
                        <dd className="mt-1 break-words font-body text-sm text-steel">
                          {registration.school}
                        </dd>
                      </div>
                      {registration.other && (
                        <div className="col-span-2 min-w-0">
                          <dt className="font-mono text-2xs uppercase tracking-[0.12em] text-muted">
                            Other
                          </dt>
                          <dd className="mt-1 break-words font-body text-sm text-steel">
                            {registration.other}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}

          {pagination && pagination.total > 0 && (
            <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p
                className="font-mono text-2xs uppercase tracking-[0.1em] text-muted"
                aria-live="polite"
              >
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} matching
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        <p className="mt-6 font-body text-xs leading-relaxed text-muted">
          Registration data is personal information. Export and store it securely, and delete
          records you no longer need.
        </p>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-space/90 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div
            ref={deleteDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="relative w-full max-w-md rounded-sm border border-line-strong bg-surface p-6 shadow-2xl"
          >
            <p className="eyebrow text-danger">Admin / Delete</p>
            <h2 id="delete-dialog-title" className="mt-3 text-display-sm">
              Remove registration?
            </h2>
            <p
              id="delete-dialog-description"
              className="mt-3 font-body text-sm leading-relaxed text-steel"
            >
              This permanently deletes{' '}
              <span className="text-star">{deleteTarget.fullName}</span>&apos;s registration
              ({deleteTarget.email}). This cannot be undone.
            </p>

            {deleteError && (
              <p role="alert" className="mt-4 font-body text-sm text-danger">
                {deleteError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                ref={cancelDeleteRef}
                variant="secondary"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete registration'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
