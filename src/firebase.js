/* eslint-disable no-undef */
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCNJjVUlQan6UURScEdZqTFrmAnWjyXplc",
  authDomain: "cloud-scheduling-project.firebaseapp.com",
  databaseURL: "https://cloud-scheduling-project-default-rtdb.firebaseio.com",
  projectId: "cloud-scheduling-project",
  storageBucket: "cloud-scheduling-project.firebasestorage.app",
  messagingSenderId: "1056568865075",
  appId: "1:1056568865075:web:a127f3601decdea0ee8e46",
});

export const auth = app.auth();
const firestore = app.firestore();
export const db = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};
export const storage = app.storage();

export default app;
