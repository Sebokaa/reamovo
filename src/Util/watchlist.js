import { doc, setDoc, getDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

export const addToWatchlist = async (movie) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User document does not exist");
  }

  await setDoc(
    userRef,
    {
      watchlist: arrayUnion(movie),
    },
    { merge: true }
  );
};

export const fetchWatchList = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User document does not exist");
  }

  return userSnap.data().watchlist;
}