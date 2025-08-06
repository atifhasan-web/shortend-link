'use server';

import * as z from 'zod';
import { saveLink } from '@/lib/db';

const formSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/),
});

type CreateShortLinkResult = {
  success: boolean;
  shortUrl?: string;
  error?: string;
};

export async function createShortLink(
  values: z.infer<typeof formSchema>
): Promise<CreateShortLinkResult> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { url, slug } = validatedFields.data;

  const result = await saveLink(slug, url);

  if (!result.success) {
    // Pass the existing slug back to the client if the URL is already taken
    if (result.error === 'This URL has already been shortened.' && result.existingSlug) {
      return { success: false, error: result.error, shortUrl: result.existingSlug };
    }
    return { success: false, error: result.error };
  }

  return { success: true, shortUrl: slug };
}
