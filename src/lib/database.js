import AWS from "aws-sdk";
import { Table } from "dynamodb-toolbox";

export const dynamo = new AWS.DynamoDB.DocumentClient();

export const table = new Table({
  name: process.env.TABLE_NAME,
  partitionKey: "pk",
  sortKey: "sk",
  entityField: "type",
  indexes: {
    "type-sk": {
      partitionKey: "type",
      sortKey: "sk",
    },
  },
  DocumentClient: dynamo,
});

export const date = () => new Date().toISOString();
export const time = (date = null) =>
  Math.floor((date || new Date()).valueOf() / 1000);
