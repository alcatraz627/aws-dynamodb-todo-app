import { DataTypeValues, DynamoDataCodes } from "@/constants/aws";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { ValueOf } from "next/dist/shared/lib/constants";

const parseDynamoSchemaValue = (value: AttributeValue): unknown => {
    if (value.S) {
        return value.S;
    }
    if (value.N) {
        return Number(value.N);
    }
    if (value.BOOL) {
        return value.BOOL;
    }
    if (value.L) {
        return value.L.map((v) => parseDynamoSchemaValue(v));
    }
    if (value.M) {
        const obj: Record<string, any> = {};
        Object.entries(value.M).forEach(([key, value]) => {
            obj[key] = parseDynamoSchemaValue(value);
        });
        return obj;
    }
    if (value.NULL) {
        return null;
    }
    if (value.B) {
        return value.B;
    }
    if (value.BS) {
        return value.BS;
    }
    if (value.NS) {
        return value.NS;
    }
    if (value.SS) {
        return value.SS;
    }
    return value;
};

export const getDataTypeKeyFromDynamoItem = (dynamoItem: AttributeValue) => {
    const key = Object.keys(dynamoItem)[0] as keyof AttributeValue;

    return key;
};

export const convertDynamoToJS = (dynamoItem: AttributeValue) => {
    const key = getDataTypeKeyFromDynamoItem(dynamoItem);
    const value = parseDynamoSchemaValue(
        dynamoItem
    ) as DataTypeValues[typeof key];

    return { key, value };
};

export const convertJSToDynamo = (
    key: keyof AttributeValue,
    value: AttributeValue[keyof AttributeValue],
    otherArgs?: Record<string, any>
): AttributeValue => {
    let dynamoValue = value;

    if (
        [
            DynamoDataCodes.STRING,
            DynamoDataCodes.NUMBER,
            DynamoDataCodes.BINARY,
        ].includes(key as any)
    ) {
        dynamoValue = `${value}`;
    }
    if (
        [
            DynamoDataCodes.STRING_ARRAY,
            DynamoDataCodes.NUMBER_ARRAY,
            DynamoDataCodes.BINARY_ARRAY,
        ].includes(key as any)
    ) {
        dynamoValue = (value as string[]).map((v) => `${v}`);
    }

    if (key === DynamoDataCodes.LIST) {
        dynamoValue = (value as unknown[]).map((v) => {
            let nestedKey: ValueOf<typeof DynamoDataCodes> =
                DynamoDataCodes.$UNKNOWN;
            if (typeof v === "string") {
                nestedKey = DynamoDataCodes.STRING;
            }
            if (typeof v === "boolean") {
                nestedKey = DynamoDataCodes.BOOLEAN;
            }
            if (typeof v === "number") {
                nestedKey = DynamoDataCodes.NUMBER;
            }
            if (typeof v === "object") {
                nestedKey = Array.isArray(v)
                    ? DynamoDataCodes.LIST
                    : DynamoDataCodes.MAP;
            }

            const parsedVal = convertJSToDynamo(nestedKey, v as any);

            return parsedVal;
        });
    }

    return { [key]: dynamoValue };
};

export interface Column {
    name: string;
    type: keyof AttributeValue;
    order?: number;
    colWidth?: number;
    default?: string; // JS eval
    validate?: string; // JS eval
}

export interface ParsedTableSchema {
    id: string;
    columns: Column[];
}

export const getDefaultColWidth = (keyName: string) => {
    if (keyName === "id") return 1;

    return 4;
};

export const parseSchemaData = (Items: Record<string, AttributeValue>[]) => {
    const schemas = Items.map((item) => {
        const id = item?.id?.S;

        const columns =
            item.schema.L?.map<Column>((v, idx) => {
                const name = v.M?.key?.S || "";
                const type = (v.M?.type?.S || "S") as keyof AttributeValue;

                const order = v.M?.order?.N ? Number(v.M.order.N) : idx;
                let colWidth = getDefaultColWidth(name);
                if (v?.M?.colWidth?.N) {
                    colWidth = Number(v.M.colWidth.N);
                }
                
                // TODO
                const defaultVal = v.M?.default?.S;

                return {
                    name,
                    type,
                    order,
                    colWidth,
                    ...(defaultVal && { default: defaultVal }),
                };
            }).filter((v) => v.name) || [];

        return { id, columns };
    });

    return schemas;
};

export const getTableSchema = (
    tableName: string,
    schemaResponse: Record<string, AttributeValue>[] = []
) => {
    return parseSchemaData(schemaResponse).find(
        (schema) => schema.id === tableName
    );
};
