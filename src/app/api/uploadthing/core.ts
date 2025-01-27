import { app } from "@/app/fb";
import { UserObj } from "@/util/util";
import { currentUser } from "@clerk/nextjs/server";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await currentUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const db = getFirestore(app);
      const userDoc = (
        await getDoc(doc(db, "Users", metadata.userId))
      ).data()! as UserObj;
      await setDoc(doc(db, "Users", metadata.userId), {
        ...userDoc!,
        img_url: file.url,
      });
      await updateDoc(doc(db, "UserNames", metadata.userId), {
        image_url: file.url,
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
