"use server";
import { SCHEMA_TABLE_NAME, awsCredentials, awsRegion } from "@/constants/aws";
import {
    AttributeValue,
    DescribeTableCommand,
    DynamoDBClient,
    ListTablesCommand,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({
    region: awsRegion,
    credentials: awsCredentials,
});

export const getTables = async () => {
    const command = new ListTablesCommand({});
    const results = await dbClient.send(command);
    return results;
};

export const getTableData = async (tableName: string) => {
    const command = new ScanCommand({
        TableName: tableName,
    });
    const results = await dbClient.send(command);
    return results;
};

export const updateData = async <Item extends Record<string, AttributeValue>>(
    tableName: string,
    item: Item
) => {
    const command = new PutItemCommand({
        TableName: tableName,
        Item: item,
    });
    const results = await dbClient.send(command);
    return results;
};

export const getSchemas = async () => {
    const results = await getTableData(SCHEMA_TABLE_NAME);

    return results;
};
