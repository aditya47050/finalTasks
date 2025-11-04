import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f({
    // Allow images, PDFs, and DOC files, with their respective max file sizes
    image: { maxFileSize: "2MB" },
    pdf: { maxFileSize: "10MB" }, // Adjust the size limit as necessary
    doc: { maxFileSize: "10MB" }  // DOC file type with size limit
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata?.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata?.userId };
    }),
};
