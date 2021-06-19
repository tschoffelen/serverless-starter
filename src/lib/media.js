import AWS from "aws-sdk";

export const s3 = new AWS.S3({ useAccelerateEndpoint: true });

const illegalRe = /[\/?<>\\:*|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;

export const sanitizeFilename = (input) =>
  input
    .replace(illegalRe, "-")
    .replace(controlRe, "-")
    .replace(reservedRe, "-")
    .replace(windowsReservedRe, "-")
    .replace(windowsTrailingRe, "-")
    .replace(/ /g, "-");

export function getSignedUrl(key, contentType, metadata = {}) {
  return s3.getSignedUrl("putObject", {
    Key: key,
    Bucket: process.env.S3_BUCKET,
    Expires: 3600,
    ContentType: contentType,
    ACL: "public-read",
    Metadata: metadata,
  });
}
