import { firebaseConfig } from "@/util/util";
import { initializeApp } from "firebase/app";

export const app = initializeApp({
  ...firebaseConfig,
  databaseURL: "https://messenger-fdf1b.nam5.firebaseio.com",
});
