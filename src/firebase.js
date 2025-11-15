import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC3Vb4AignmfNEZLVfc7Jd9zGhQ95JztdE",
  authDomain: "lista-de-filmes-assistidos.firebaseapp.com",
  projectId: "lista-de-filmes-assistidos",
  storageBucket: "lista-de-filmes-assistidos.firebasestorage.app",
  messagingSenderId: "698336944150",
  appId: "1:698336944150:web:5c1a72b449273885dd1537"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };