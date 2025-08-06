// This is a mock database. In a real application, you would use a proper database like Firestore, PostgreSQL, etc.
// The data is not persisted between server restarts.
const links = new Map<string, string>();

export async function saveLink(slug: string, url: string): Promise<{ success: boolean; error?: string }> {
  if (links.has(slug)) {
    return { success: false, error: 'This custom name is already taken.' };
  }
  links.set(slug, url);
  console.log(`Saved: ${slug} -> ${url}`);
  console.log('Current links:', links);
  return { success: true };
}

export async function getLink(slug: string): Promise<string | null> {
  const url = links.get(slug) || null;
  console.log(`Retrieved: ${slug} -> ${url}`);
  return url;
}
