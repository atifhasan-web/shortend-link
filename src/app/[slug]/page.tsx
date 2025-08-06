import { getLink } from '@/lib/db';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const longUrl = await getLink(slug);

  if (longUrl) {
    redirect(longUrl);
  } else {
    notFound();
  }

  return null; // This component will either redirect or show a 404, so it never renders anything.
}
