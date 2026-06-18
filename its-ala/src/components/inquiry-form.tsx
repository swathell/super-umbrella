"use client";

import { useMemo, useState } from "react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  industry: string;
  teamSize: string;
  projectType: string;
  timeline: string;
  budget: string;
  projectSummary: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  industry: "",
  teamSize: "",
  projectType: "",
  timeline: "",
  budget: "",
  projectSummary: "",
};

const projectTypeOptions = [
  { value: "client-delivery", label: "Client delivery operations" },
  { value: "internal-operations", label: "Internal workflow operations" },
  { value: "revenue-visibility", label: "Revenue and pipeline visibility" },
  { value: "ai-workflow", label: "AI-assisted workflow automation" },
  { value: "mixed", label: "Mixed operating system build" },
];

const industryOptions = [
  { value: "consulting", label: "Consulting" },
  { value: "venture-advisory", label: "Venture / advisory" },
  { value: "professional-services", label: "Professional services" },
  { value: "enterprise-operations", label: "Enterprise operations" },
  { value: "other", label: "Other" },
];

const teamSizeOptions = [
  { value: "1-10", label: "1 to 10" },
  { value: "11-50", label: "11 to 50" },
  { value: "51-200", label: "51 to 200" },
  { value: "201-plus", label: "201+" },
];

export function InquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const summaryCount = useMemo(() => values.projectSummary.length, [values.projectSummary]);
  const isSubmitting = status === "submitting";

  function updateField(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          source: "website-demo-request",
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: Record<string, string>;
        storage?: string;
        notifications?: {
          operator: "sent" | "skipped" | "failed";
          confirmation: "sent" | "skipped" | "failed";
        };
      };

      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        setMessage(data.message ?? "Please review the form and try again.");
        return;
      }

      setValues(initialValues);
      setErrors({});
      setStatus("success");

      const storageMessage =
        data.storage === "postgres"
          ? "Demo request sent. It was stored in production-ready database storage."
          : "Demo request sent. It was stored successfully using the local development fallback.";

      const notificationWarning =
        data.notifications &&
        (data.notifications.operator === "failed" || data.notifications.confirmation === "failed")
          ? " Email delivery needs attention in this environment."
          : "";

      setMessage(`${storageMessage}${notificationWarning}`);
    } catch {
      setStatus("error");
      setMessage("Network issue. Please try again in a moment.");
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Step 1</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">Company context</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Your name"
            name="name"
            value={values.name}
            onChange={updateField}
            error={errors.name}
            placeholder="Ala Obeidat"
          />
          <Field
            label="Work email"
            name="email"
            value={values.email}
            onChange={updateField}
            error={errors.email}
            placeholder="you@company.com"
            type="email"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Company"
            name="company"
            value={values.company}
            onChange={updateField}
            error={errors.company}
            placeholder="Firm or company name"
          />
          <SelectField
            label="Industry"
            name="industry"
            value={values.industry}
            onChange={updateField}
            error={errors.industry}
            options={industryOptions}
          />
          <SelectField
            label="Team size"
            name="teamSize"
            value={values.teamSize}
            onChange={updateField}
            error={errors.teamSize}
            options={teamSizeOptions}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">Step 2</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">Use case and urgency</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Primary use case"
            name="projectType"
            value={values.projectType}
            onChange={updateField}
            error={errors.projectType}
            options={projectTypeOptions}
          />
          <SelectField
            label="Timeline"
            name="timeline"
            value={values.timeline}
            onChange={updateField}
            error={errors.timeline}
            options={[
              { value: "asap", label: "ASAP" },
              { value: "2-4-weeks", label: "2 to 4 weeks" },
              { value: "1-2-months", label: "1 to 2 months" },
              { value: "exploring", label: "Still exploring" },
            ]}
          />
          <SelectField
            label="Budget"
            name="budget"
            value={values.budget}
            onChange={updateField}
            error={errors.budget}
            options={[
              { value: "under-5k", label: "Under $5k" },
              { value: "5k-15k", label: "$5k to $15k" },
              { value: "15k-40k", label: "$15k to $40k" },
              { value: "40k-plus", label: "$40k+" },
            ]}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink" htmlFor="projectSummary">
            What problem are you trying to solve?
          </label>
          <textarea
            id="projectSummary"
            value={values.projectSummary}
            onChange={(event) => updateField("projectSummary", event.target.value)}
            placeholder="Describe the workflow, delivery issue, reporting gap, or commercial bottleneck that needs to change. Include what happens today and what a better outcome would look like."
            className="min-h-40 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
          />
          <div className="flex items-center justify-between text-sm">
            <span className={errors.projectSummary ? "text-red-600" : "text-slate"}>
              {errors.projectSummary ||
                "Enough detail to understand the operating problem is enough for a strong first call."}
            </span>
            <span className="font-mono text-xs text-slate">{summaryCount}/4000</span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-7 text-slate">
          Typical fit: consulting, advisory, and professional services teams that need a clearer
          operating layer around revenue, delivery, and workflow execution.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-white transition hover:bg-night disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending request..." : "Request demo"}
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {message}
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  name: keyof FormValues;
  value: string;
  onChange: (name: keyof FormValues, value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-ink" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-line bg-white/80 px-4 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
      />
      <p className="min-h-5 text-sm text-red-600">{error ?? ""}</p>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  name: keyof FormValues;
  value: string;
  onChange: (name: keyof FormValues, value: string) => void;
  error?: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-ink" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-14 w-full rounded-2xl border border-line bg-white/80 px-4 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="min-h-5 text-sm text-red-600">{error ?? ""}</p>
    </div>
  );
}
