import { middleware, auth } from "@flexible-agency/serverless-middleware";
import { v4 as uuid } from "uuid";

import { getSignedUrl, sanitizeFilename } from "../../../lib/media";

const dependencies = () => ({
  getSignedUrl,
  uuid,
});

export const app = async (
  {
    query: {
      type = "avatar",
      filename = "image.jpg",
      contentType = "image/jpeg",
    },
  },
  { currentUser, getSignedUrl, uuid }
) => {
  const safeFilename = sanitizeFilename(filename);
  const safeType = sanitizeFilename(type);
  const key = `${safeType}/${currentUser.id}/${uuid()}/${safeFilename}`;

  const uploadUrl = getSignedUrl(key, contentType, {
    "x-upload-user": currentUser.id,
    "x-upload-category": safeType,
    "x-upload-filename": filename,
  });

  return {
    uploadUrl,
    publicUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`,
  };
};

export const handler = middleware(app, [auth]).register(dependencies);
