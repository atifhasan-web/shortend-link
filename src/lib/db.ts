import { db } from './firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const linksCollection = collection(db, 'links');

export async function saveLink(slug: string, url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'links', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: false, error: 'This custom name is already taken.' };
    }

    await setDoc(docRef, { url });
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
