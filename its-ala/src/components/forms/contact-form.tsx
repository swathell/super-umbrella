"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message: string };

      if (!response.ok) {
        setState("error");
        setMessage(data.message || "Something went wrong.");
        return;
      }

      form.reset();
      setState("success");
      setMessage(data.message);
    } catch {
      setState("error");
      setMessage("The request did not complete. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-soft">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Name</span>
          <input
            required
            name="name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            placeholder="Ala Obeidat"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Email</span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Company or team</span>
          <input
            name="company"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            placeholder="Its Ala"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Ideal timeline</span>
          <select
            name="timeline"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            defaultValue="Within 2 weeks"
          >
            <option>Within 2 weeks</option>
            <option>Within 1 month</option>
            <option>Flexible / exploring</option>
            <option>Urgent</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">What do you need?</span>
          <select
            name="projectType"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            defaultValue="Internal tool"
          >
            <option>Internal tool</option>
            <option>MVP build</option>
            <option>AI workflow</option>
            <option>Discovery sprint</option>
            <option>Existing system rescue</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Budget range</span>
          <select
            name="budget"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
            defaultValue="$1k-$3k"
          >
            <option>$1k-$3k</option>
            <option>$3k-$7k</option>
            <option>$7k+</option>
            <option>Need guidance</option>
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-semibold">Project summary</span>
        <textarea
          required
          name="summary"
          rows={6}
          className="w-full rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-accent"
          placeholder="Tell me what is broken, what should exist instead, who uses it, and what a good outcome looks like."
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-slate">
          After you submit, you’ll get a reply with a recommendation, scope direction, or next step. No long sales maze.
        </p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-ink px-7 py-4 font-semibold text-sand transition hover:bg-night disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? "Sending..." : "Send inquiry"}
        </button>
      </div>

      {message ? (
        <p
          className={
            state === "success"
              ? "rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
