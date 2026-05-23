export type InquiryInput = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget: string;
  projectSummary: string;
  source?: string;
};

export type InquiryRecord = InquiryInput & {
  id: string;
  createdAt: string;
};

type ValidationResult =
  | { success: true; data: InquiryInput }
  | { success: false; errors: Record<string, string> };

const PROJECT_TYPES = new Set([
  "custom-app",
  "internal-tool",
  "ai-workflow",
  "mixed",
]);

const TIMELINES = new Set([
  "asap",
  "2-4-weeks",
  "1-2-months",
  "exploring",
]);

const BUDGETS = new Set([
  "under-5k",
  "5k-15k",
  "15k-40k",
  "40k-plus",
]);

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateInquiry(payload: unknown): ValidationResult {
  const raw = payload as Record<string, unknown>;

  const data: InquiryInput = {
    name: normalizeText(raw?.name, 120),
    email: normalizeText(raw?.email, 160).toLowerCase(),
    company: normalizeText(raw?.company, 160),
    projectType: normalizeText(raw?.projectType, 80),
    timeline: normalizeText(raw?.timeline, 80),
    budget: normalizeText(raw?.budget, 80),
    projectSummary: normalizeText(raw?.projectSummary, 4000),
    source: normalizeText(raw?.source, 160) || "website",
  };

  const errors: Record<string, string> = {};

  if (data.name.length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!PROJECT_TYPES.has(data.projectType)) {
    errors.projectType = "Please choose the type of project.";
  }

  if (!TIMELINES.has(data.timeline)) {
    errors.timeline = "Please choose a timeline.";
  }

  if (!BUDGETS.has(data.budget)) {
    errors.budget = "Please choose a budget range.";
  }

  if (data.projectSummary.length < 30) {
    errors.projectSummary =
      "Please share a bit more detail so the inquiry can be reviewed properly.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
}
