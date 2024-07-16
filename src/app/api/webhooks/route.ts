"use server";
import { firebaseConfig, UserName, UserObj } from "@/util/util";
import { WebhookEvent } from "@clerk/nextjs/server";
import { initializeApp } from "firebase/app";
import { headers } from "next/headers";
import { Webhook } from "svix";
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "../../../app/fb";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get event type, auth, and database
  const eventType = evt.type;
  const auth = app;
  const db = getFirestore(app);

  if (eventType === "user.created") {
    // get event data from clerk UserJson
    const data = evt.data;
    const { id, email_addresses, image_url, first_name } = data;

    console.log("creating firestore user");

    await setDoc(doc(db, "Users", id), {
      id,
      displayName: first_name,
      complete: false,
      email: email_addresses[0].email_address,
      img_url: image_url,
      blocked: [],
      blockedBy: [],
      chats: [],
      friends: [],
      messaged: [],
      userName: "",
    } as UserObj);
    await setDoc(doc(db, "UserNames", id), {
      id,
      name: "",
      displayName: first_name,
    } as UserName);

    console.log("created firestore user successfully");
  } else if (eventType === "user.deleted") {
    const data = evt.data;
    const { id } = data;
    console.log("deleting firestore user");
    await deleteDoc(doc(db, "Users", id!)).catch((error) => {
      console.error(error);
    });
    await deleteDoc(doc(db, "UserNames", id!)).catch((error) => {
      console.error(error);
    });

    console.log("successfully deleted firestore user");
  } else if (eventType === "user.updated") {
    console.log(evt.data);
  } else {
    console.log(eventType);
  }

  return new Response("", { status: 200 });
}
