import { createClient } from "next-sanity";

// Falls back to placeholder so build doesn't crash before env is set
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const enableContentLinks = process.env.VERCEL === "1" || process.env.NODE_ENV === "development";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // cached, fast. Set false for fresh preview data
  perspective: "published",
  stega: {
    enabled: enableContentLinks,
    studioUrl: "/studio",
    filter: (props) => {
      const sourcePath = props.sourcePath.map(String);

      if (sourcePath.includes("slug") || sourcePath.includes("publishedAt")) {
        return false;
      }

      return props.filterDefault(props);
    },
  },
});

// helper: check if configured
export const isSanityConfigured = () =>
  projectId !== "missing-project-id" && !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
