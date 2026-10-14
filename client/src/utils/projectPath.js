// Builds the public URL for a project's detail page.
// Uses the slug when it is URL-safe, otherwise falls back to the project's _id
// (the API accepts both), so a card can never link to a page that 404s.
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectPath = (project) => {
  const key = SAFE_SLUG.test(project?.slug || '') ? project.slug : project?._id;
  return `/projects/${encodeURIComponent(key)}`;
};
