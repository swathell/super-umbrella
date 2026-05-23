"use client";

import { useMemo, useState } from "react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  projectSummary: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  timeline: "",
  budget: "",
  projectSummary: "",
};

export function InquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const isSubmitting = status === "submitting";

  const summaryCount = useMemo(() => values.projectSummary.length, [values.projectSummary]);

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
          source: "website",
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
        setMessage(
          data.message ?? "Please review the form and try again.",
        );
        return;
      }

      setValues(initialValues);
      setErrors({});
      setStatus("success");
      const storageMessage =
        data.storage === "postgres"
          ? "Inquiry sent. It was stored in production-ready database storage."
          : "Inquiry sent. It was stored successfully using the local development fallback.";

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
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          value={values.name}
          onChange={updateField}
          error={errors.name}
          placeholder="Ala Obeidat"
        />
        <Field
          label="Email"
          name="email"
          value={values.email}
          onChange={updateField}
          error={errors.email}
          placeholder="you@company.com"
          type="email"
        />
      </div>

      <Field
        label="Company"
        name="company"
        value={values.company}
        onChange={updateField}
        error={errors.company}
        placeholder="Company or team name"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          label="Project type"
          name="projectType"
          value={values.projectType}
          onChange={updateField}
          error={errors.projectType}
          options={[
            { value: "custom-app", label: "Custom app" },
            { value: "internal-tool", label: "Internal tool" },
            { value: "ai-workflow", label: "AI workflow" },
            { value: "mixed", label: "Mixed build" },
          ]}
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
          What needs to be built
        </label>
        <textarea
          id="projectSummary"
          value={values.projectSummary}
          onChange={(event) => updateField("projectSummary", event.target.value)}
          placeholder="Share the workflow, bottleneck, or system you need built. Include what exists today and what a successful result would look like."
          className="min-h-40 w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
        />
        <div className="flex items-center justify-between text-sm">
          <span className={errors.projectSummary ? "text-red-600" : "text-slate"}>
            {errors.projectSummary || "The more concrete this is, the faster the first reply can be."}
          </span>
          <span className="font-mono text-xs text-slate">{summaryCount}/4000</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-slate">
          Best fit: founders and small teams with a defined workflow problem, a real use case,
          and a clear need for speed.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-white transition hover:bg-night disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending inquiry..." : "Send inquiry"}
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
        className="h-14 w-full rounded-full border border-line bg-white/80 px-4 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
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
  options: { value: string; label: string }[];
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
        className="h-14 w-full rounded-full border border-line bg-white/80 px-4 text-base text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-orange-100"
      >
        <option value="">Select</option>
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
