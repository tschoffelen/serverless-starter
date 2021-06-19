import AWS from "aws-sdk";

const bridge = new AWS.EventBridge();

const createEventEntry = (type, data = {}) => ({
  Source: process.env.SERVICE,
  DetailType: type,
  Detail: JSON.stringify({ data }),
});

export const sendEvent = async (type, data = {}) =>
  bridge
    .putEvents({
      Entries: [createEventEntry(type, data)],
    })
    .promise();
