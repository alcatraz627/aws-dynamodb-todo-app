import { AttributeValue } from "@aws-sdk/client-dynamodb";
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

type ValueOf<T> = T[keyof T];

// export const DynamoDataCodes = {
//     STRING: "S" as keyof NonNullable<AttributeValue.SMember>,
//     NUMBER: "N" as keyof NonNullable<AttributeValue.NMember>,
//     BINARY: "B" as keyof NonNullable<AttributeValue.BMember>,
//     STRING_ARRAY: "SS" as keyof NonNullable<AttributeValue.SSMember>,
//     NUMBER_ARRAY: "NS" as keyof NonNullable<AttributeValue.NSMember>,
//     BINARY_ARRAY: "BS" as keyof NonNullable<AttributeValue.BSMember>,
//     MAP: "M" as keyof NonNullable<AttributeValue.MMember>,
//     LIST: "L" as keyof NonNullable<AttributeValue.LMember>,
//     BOOLEAN: "BOOL" as keyof NonNullable<AttributeValue.BOOLMember>,
//     NULL: "NULL" as keyof NonNullable<AttributeValue.NULLMember>,
//     $unknown: "$unknown" as keyof NonNullable<AttributeValue.$UnknownMember>,
// } as const;

export const DynamoDataCodes = {
    STRING: "S",
    NUMBER: "N",
    BINARY: "B",
    STRING_ARRAY: "SS",
    NUMBER_ARRAY: "NS",
    BINARY_ARRAY: "BS",
    MAP: "M",
    LIST: "L",
    BOOLEAN: "BOOL",
    NULL: "NULL",
    $UNKNOWN: "$unknown",
} as const;

const dataTypeForCode: Record<
    ValueOf<typeof DynamoDataCodes>,
    keyof typeof DynamoDataCodes
> = Object.assign(
    {},
    ...Object.entries(DynamoDataCodes).map(([k, v]) => ({ [v]: k }))
);

export const getDataTypeFromCode = (
    code: ValueOf<typeof DynamoDataCodes>
): keyof typeof DynamoDataCodes | null => {
    if (code in dataTypeForCode) return dataTypeForCode[code];

    return null;
};

export type DynamoDataCodesUnion =
    (typeof DynamoDataCodes)[keyof typeof DynamoDataCodes];

export interface DataTypeValues {
    [DynamoDataCodes.STRING]: string;
    [DynamoDataCodes.NUMBER]: number;
    [DynamoDataCodes.BOOLEAN]: boolean;
    [DynamoDataCodes.BINARY]: string;

    [DynamoDataCodes.NULL]: null;
    [DynamoDataCodes.$UNKNOWN]: never;

    [DynamoDataCodes.STRING_ARRAY]: string[];
    [DynamoDataCodes.NUMBER_ARRAY]: number[];
    [DynamoDataCodes.BINARY_ARRAY]: string[];

    [DynamoDataCodes.LIST]: DataTypeValues[];
    [DynamoDataCodes.MAP]: Record<string, DataTypeValues>;
}

export const SCHEMA_TABLE_NAME = "schemas"; // TODO: Move to .env
