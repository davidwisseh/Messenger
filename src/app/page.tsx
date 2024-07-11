import Image from "next/image";
import Navbar from "../components/NavBar";
import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { auth as useAuth } from "@clerk/nextjs/server";
import { initializeApp } from "firebase/app";

export default async function Home() {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "messenger-fdf1b.firebaseapp.com",
    projectId: "messenger-fdf1b",
    storageBucket: "messenger-fdf1b.appspot.com",
    messagingSenderId: "70071304038",
    appId: "1:70071304038:web:137a06f0b6f96b8dae92a7",
    measurementId: "G-BGRXQL8988",
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  // Connect to Firebase auth
  const auth = getAuth(app);

  return (
    <>
      <Navbar></Navbar>
    </>
  );
}
