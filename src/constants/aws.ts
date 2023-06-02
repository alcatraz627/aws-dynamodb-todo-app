import type { AwsCredentialIdentity } from "@aws-sdk/types/dist-types/identity/AwsCredentialIdentity";

export const awsRegion = "ap-south-1";

export const awsCredentials: AwsCredentialIdentity = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
};

export const awsConfiguration = {
    region: awsRegion,
    credentials: awsCredentials,
};
