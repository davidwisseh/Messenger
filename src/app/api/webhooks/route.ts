"use server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/util/util";
import { getAuth } from "firebase-admin/auth";
import * as firebase from "firebase-admin";

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT!);

const app = firebase.initializeApp({
  ...firebaseConfig,
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://messenger-fdf1b.firebaseio.com",
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
    auth
      .getUser(userId)
      .then((userRecord) => {
        console.log(userRecord.email);
      })
      .catch(async (err) => {
        if (err.errorInfo.code === "app/invalid-credential") {
          await auth.createUser({ uid: userId });
        } else {
          return new Response("error", { status: 400 });
        }
      });
  }

  return new Response("", { status: 200 });
}
