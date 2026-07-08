import { createClient } from "next-sanity";

// Falls back to placeholder so build doesn't crash before env is set
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // cached, fast. Set false for fresh preview data
  perspective: "published",
});

// helper: check if configured
export const isSanityConfigured = () =>
  projectId !== "missing-project-id" && !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
