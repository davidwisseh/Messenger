"use server";
import { firebaseConfig } from "@/util/util";
import { WebhookEvent } from "@clerk/nextjs/server";
import * as firebase from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { Webhook } from "svix";


const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT!);
const app = firebase.initializeApp({
  ...firebaseConfig,
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://messenger-fdf1b.nam5.firebaseio.com",
});

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
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (eventType === "user.created") {
    // get event data from clerk UserJson
    const data = evt.data;
    const { id, email_addresses, image_url } = data;

    await auth
      .createUser({
        uid: id,
        email: email_addresses.at(0)?.email_address,
      })
      .then(() => {
        console.log("created firebase user successfully");
      })
      .catch((err) => {
        console.error("Error Creating User: ", err);

        return new Response("error", { status: 400 });
      });

    console.log("creating firestore user");
    await db.collection("Users").add({
      id,
      email_address: email_addresses.at(0)?.email_address,
      image_url,
    });
    console.log("created firestore user successfully");
  } else if (eventType === "user.deleted") {
    const data = evt.data;
    const { id } = data;

    await auth
      .deleteUser(id!)
      .then(() => {
        console.log("deleted from firebase successfully");
      })
      .catch((error) => {
        console.log("error deleting from firebase");
        return new Response("error", { status: 400 });
      });

    console.log("deleting firestore user");
    const userRef = await db.collection("Users").where("id", "==", id).get();
    userRef.forEach((user) => {
      user.ref.delete();
    });
    console.log("successfully deleted firestore user");
  } else if (eventType === "user.updated") {
    console.log(evt.data);
  } else {
    console.log(eventType);
  }

  return new Response("", { status: 200 });
}
