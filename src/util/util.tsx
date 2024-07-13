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
}
