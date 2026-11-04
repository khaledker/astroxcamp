import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AssetPlaceholder } from '../components/AssetPlaceholder';
import { Button, buttonClassName } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { EVENT, FULL_TITLE } from '../data/event';
import { getErrorMessage, submitRegistration, ApiError } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  emptyRegistrationForm,
  isRegistrationField,
  validateRegistrationField,
  validateRegistrationForm,
  type RegistrationField,
  type RegistrationFormValues,
} from '../lib/registration-schema';

type FieldErrors = Partial<Record<RegistrationField, string>>;
type TouchedFields = Partial<Record<RegistrationField, boolean>>;

const fieldIds: Record<RegistrationField, string> = {
  fullName: 'registration-full-name',
  email: 'registration-email',
  phone: 'registration-phone',
  school: 'registration-school',
  other: 'registration-other',
};

export function RegisterPage() {
  useDocumentTitle(`Register — ${FULL_TITLE}`);
  const navigate = useNavigate();

  const [values, setValues] = useState<RegistrationFormValues>(emptyRegistrationForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const focusFirstError = () => {
    window.setTimeout(() => {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
    }, 0);
  };

  const handleChange = (field: RegistrationField, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValues((previous) => ({ ...previous, [field]: value }));
    setFormError(null);

    if (touched[field]) {
      const message = validateRegistrationField(field, value);
      setErrors((previous) => {
        const next = { ...previous };
        if (message) next[field] = message;
        else delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: RegistrationField) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
    const message = validateRegistrationField(field, values[field]);
    setErrors((previous) => {
      const next = { ...previous };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const validation = validateRegistrationForm(values);
    if (!validation.values) {
      setErrors(validation.errors);
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        school: true,
        other: true,
      });
      focusFirstError();
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRegistration({
        ...validation.values,
        other: validation.values.other || undefined,
      });
      navigate('/register/success', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          const serverErrors: FieldErrors = {};
          for (const [field, message] of Object.entries(error.fields)) {
            if (isRegistrationField(field)) serverErrors[field] = message;
          }
          setErrors((previous) => ({ ...previous, ...serverErrors }));
          if (serverErrors.email) {
            window.setTimeout(() => {
              document.getElementById(fieldIds.email)?.focus();
            }, 0);
          }
        }
        setFormError(error.message);
        if (error.status !== 409) {
          formRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else {
        setFormError(getErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="site-container py-10 md:py-16 xl:py-20" aria-labelledby="register-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        <div className="flex flex-col items-start">
          <Link
            to="/"
            className={buttonClassName({
              variant: 'secondary',
              className: 'w-full sm:w-auto',
            })}
          >
            Back to landing
          </Link>

          <p className="eyebrow mt-10">03 / Registration</p>

          <h1 id="register-heading" className="mt-5 text-display-register">
            <span className="block">Register for</span>
            <span className="block">AstroXcamp</span>
            <span className="block">{EVENT.edition}</span>
          </h1>

          <p className="mt-7 font-body text-body-lg text-steel">{EVENT.club}</p>

          <p className="mt-6 font-mono text-sm uppercase tracking-[0.08em] text-yellow">
            {EVENT.dateLabel} <span className="px-2 text-muted">/</span> {EVENT.locationLabel}
          </p>

          <div className="mt-10 flex w-full max-w-[22rem] items-center justify-center lg:mt-14">
            <AssetPlaceholder
              asset="registerPlanet"
              className="h-[14rem] w-full max-w-[20rem] sm:h-[17.5rem]"
            />
          </div>
        </div>

        <Card className="w-full self-start p-6 md:p-8 lg:max-w-form lg:justify-self-end xl:p-10">
          <h2 className="font-display text-display-card">Your details</h2>
          <p className="mt-2 font-body text-body text-steel">{FULL_TITLE}</p>

          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-7 md:mt-8 md:gap-8"
          >
            {formError && (
              <div
                role="alert"
                className="rounded-sm border border-danger/50 bg-danger/5 px-4 py-3 font-body text-sm text-danger"
              >
                {formError}
              </div>
            )}

            <Input
              id={fieldIds.fullName}
              label="Full name"
              name="fullName"
              autoComplete="name"
              placeholder="Enter full name"
              value={values.fullName}
              onChange={(event) => handleChange('fullName', event)}
              onBlur={() => handleBlur('fullName')}
              error={errors.fullName}
              required
            />

            <Input
              id={fieldIds.email}
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="Enter email"
              value={values.email}
              onChange={(event) => handleChange('email', event)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              required
            />

            <Input
              id={fieldIds.phone}
              label="Phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Enter phone"
              value={values.phone}
              onChange={(event) => handleChange('phone', event)}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
              required
            />

            <Input
              id={fieldIds.school}
              label="University or school"
              name="school"
              autoComplete="organization"
              placeholder="Enter university or school"
              value={values.school}
              onChange={(event) => handleChange('school', event)}
              onBlur={() => handleBlur('school')}
              error={errors.school}
              required
            />

            <Input
              id={fieldIds.other}
              label="[other]"
              name="other"
              placeholder="[other]"
              value={values.other}
              onChange={(event) => handleChange('other', event)}
              onBlur={() => handleBlur('other')}
              error={errors.other}
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="mt-2 w-full sm:w-auto sm:self-start"
            >
              {isSubmitting ? 'Registering…' : 'Register'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
