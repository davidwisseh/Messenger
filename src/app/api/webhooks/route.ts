"use server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { firebaseConfig } from "@/util/util";
import { getAuth } from "firebase-admin/auth";
import * as firebase from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { doc, getDoc } from "firebase/firestore";

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
  const { id } = evt.data;
  const eventType = evt.type;

  const { data } = payload;
  const userId = data.user_id;

  if (eventType === "session.created") {
    console.log(eventType);
    const auth = getAuth(app);
    await auth
      .getUser(userId)
      .then((userRecord) => {
        console.log(`got user from firebase Auth`);
      })
      .catch(async (err) => {
        console.log(err);
        if (err.errorInfo.code === "auth/user-not-found") {
          console.log("creating user");
          await auth
            .createUser({ uid: userId })
            .then(() => {
              console.log("created user successfully");
            })
            .catch((err) => {
              console.error("Error Creating User: ", err);

              return new Response("error", { status: 400 });
            });
        } else {
          return new Response("error", { status: 400 });
        }
      });

    const db = getFirestore();
    const usersRef = await db.collection("Users").get();
    const user = usersRef.docs.filter((doc) => doc.id === userId);

    if (user.length) {
      console.log(user[0].data);
    } else {
      console.log("no user");
    }
  }

  return new Response("", { status: 200 });
}
