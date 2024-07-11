import Image from "next/image";
import Navbar from "../components/NavBar";
import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { auth as useAuth } from "@clerk/nextjs/server";
import { initializeApp } from "firebase/app";

export default async function Home() {
  return (
    <>
      <Navbar></Navbar>
    </>
  );
}
