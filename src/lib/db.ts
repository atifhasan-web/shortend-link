import { db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs, limit } from 'firebase/firestore';

const linksCollection = collection(db, 'links');

type SaveLinkResult = {
  success: boolean;
  error?: string;
  existingSlug?: string;
};


export async function saveLink(slug: string, url: string): Promise<SaveLinkResult> {
  try {
    const slugDocRef = doc(db, 'links', slug);
    const slugDocSnap = await getDoc(slugDocRef);

    if (slugDocSnap.exists()) {
      // If the slug is taken, check if it's for the same URL.
      if (slugDocSnap.data().url === url) {
        return { success: true }; // Already exists, treat as success.
      }
      return { success: false, error: 'This custom name is already taken.' };
    }

    // Check if the URL has already been shortened with a different slug.
    const urlQuery = query(linksCollection, where('url', '==', url), limit(1));
    const urlQuerySnapshot = await getDocs(urlQuery);

    if (!urlQuerySnapshot.empty) {
      const existingDoc = urlQuerySnapshot.docs[0];
      return {
        success: false,
        error: 'This URL has already been shortened.',
        existingSlug: existingDoc.id,
      };
    }

    // If neither slug nor URL exists, create the new link.
    await setDoc(slugDocRef, { url });
    console.log(`Saved: ${slug} -> ${url}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving link: ", error);
    return { success: false, error: 'An error occurred while saving the link.' };
  }
}

export async function getLink(slug: string): Promise<string | null> {
  try {
    const docRef = doc(db, 'links', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const url = docSnap.data().url;
      console.log(`Retrieved: ${slug} -> ${url}`);
      return url;
    } else {
      console.log(`No link found for slug: ${slug}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting link: ", error);
    return null;
  }
}
