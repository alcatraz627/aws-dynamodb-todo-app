import { awsCredentials, awsRegion } from "@/constants/aws";
import {
    DynamoDBClient,
    ListTablesCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";

export const dbClient = new DynamoDBClient({
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
