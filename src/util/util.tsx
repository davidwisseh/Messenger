import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "messenger-fdf1b.firebaseapp.com",
  projectId: "messenger-fdf1b",
  storageBucket: "messenger-fdf1b.appspot.com",
  messagingSenderId: "70071304038",
  appId: "1:70071304038:web:137a06f0b6f96b8dae92a7",
  measurementId: "G-BGRXQL8988",
};

export interface Message {
  from: string;
  to: string;
  message: string;
  read: boolean;
  time: number;
  id: string;
}
export interface Messaged {
  user: string;
  chat: string;
}

export interface UserObj {
  friends: string[];
  blocked: string[];
  blockedBy: string[];
  displayName: string;
  id: string;
  email: string;
  img_url: string;
  messaged: Messaged[];
  complete: boolean;
  userName: string;
}

export interface Chat {
  messages: Message[];
}

export interface UserName {
  id: string;
  name: string;
  displayName: string;
  image_url: string;
}
