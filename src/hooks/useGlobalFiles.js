import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export function useGlobalFiles() {
  const { currentUser } = useAuth();
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = db.files
      .where("userId", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        setAllFiles(snapshot.docs.map(db.formatDoc));
        setLoading(false);
      });

    return unsubscribe;
  }, [currentUser]);

  return { allFiles, loading };
}
