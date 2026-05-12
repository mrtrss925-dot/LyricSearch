import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt19rWpy3dwzVdabWxE-NTypV362rn3YM",
  authDomain: "esame-informatica2.firebaseapp.com",
  projectId: "esame-informatica2",
  storageBucket: "esame-informatica2.firebasestorage.app",
  messagingSenderId: "181921527773",
  appId: "1:181921527773:web:d0d97ef406444128706834"
};

const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app);

export default {
  db: firestoreDb,

  isAuthenticated: function () {
    return localStorage.getItem("login") ? true : false;
  },

  verificaLogin: async function (username, password) {
    const docRef = await getDoc(doc(firestoreDb, "utenti", username));
    if (docRef.exists()) {
      if (docRef.data()["password"] === password) {
        return { username, ...docRef.data() };
      }
      throw new Error("La password è sbagliata");
    } else {
      throw new Error("Lo username inserito non esiste");
    }
  },

  getUser: function () {
    return localStorage.getItem("login");
  },

  getUserData: async function () {
    const username = localStorage.getItem("login");
    if (!username) return null;
    const docRef = await getDoc(doc(firestoreDb, "utenti", username));
    if (docRef.exists()) {
      return { username, ...docRef.data() };
    }
    return null;
  },

  updateUserData: async function (username, data) {
    const docRef = doc(firestoreDb, "utenti", username);
    await updateDoc(docRef, data);
  },

  setUser: function (username) {
    localStorage.setItem("login", username);
  },

  logout: function () {
    localStorage.removeItem("login");
  },

  getPreferiti: async function () {
    const q = query(
      collection(firestoreDb, "preferiti"),
      where("utente", "==", this.getUser())
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data()["trackId"]);
  },

  addPreferito: async function (trackId) {
    await addDoc(collection(firestoreDb, "preferiti"), {
      trackId: String(trackId),
      utente: this.getUser(),
    });
  },

  removePreferito: async function (trackId) {
    const q = query(
      collection(firestoreDb, "preferiti"),
      where("utente", "==", this.getUser()),
      where("trackId", "==", String(trackId))
    );
    const snapshot = await getDocs(q);
    const b = writeBatch(firestoreDb);
    for (let document of snapshot.docs) {
      b.delete(doc(firestoreDb, "preferiti", document.id));
    }
    await b.commit();
  },
};
