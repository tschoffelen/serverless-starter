import AWS from "aws-sdk";
import User from "./entities/User";

const cognito = new AWS.CognitoIdentityServiceProvider();
const { USER_POOL_ID: UserPoolId } = process.env;

export const createUser = async (userId) => {
  const user = await cognito
    .adminGetUser({
      UserPoolId,
      Username: userId,
    })
    .promise();
  if (!user.Enabled) {
    throw new Error("Unknown user.");
  }
  const name = user.UserAttributes.find(({ Name }) => Name === "name");
  // TODO: should also sync nickname + picture (and maybe be consistent in naming those attributes?)
  const { Attributes } = await User.update(
    {
      id: user.Username,
      createdAt: new Date(user.UserCreateDate).toISOString(),
      updatedAt: new Date(user.UserLastModifiedDate).toISOString(),
      email: user.UserAttributes.find(({ Name }) => Name === "email").Value,
      name: name && name.Value,
    },
    {
      returnValues: "ALL_NEW",
    }
  );

  return Attributes;
};

export const updateUserAttributes = async (userId, attributes) => {
  return cognito
    .adminUpdateUserAttributes({
      UserPoolId,
      Username: userId,
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
        ...Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
      ],
    })
    .promise();
};
