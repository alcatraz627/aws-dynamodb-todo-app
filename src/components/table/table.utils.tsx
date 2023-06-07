import {
    DynamoDataCodes,
    DynamoDataCodesUnion,
    DataTypeValues,
    getDataTypeFromCode,
} from "@/constants/aws";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { ReactNode } from "react";

export const renderDataType = <T extends keyof AttributeValue>(
    dataType: T,
    dataVal: AttributeValue[T],
    handleChange?: (newVal: string) => void
): ReactNode => {
    let renderer: (v: any) => ReactNode = (val: any) => (
        <div>{JSON.stringify(val)}</div>
    );
    switch (dataType) {
        case DynamoDataCodes.STRING:
        case DynamoDataCodes.NUMBER:
        case DynamoDataCodes.BINARY:
            renderer = (val: string | number) => (
                // <div
                //     contentEditable
                //     onChange={(e) => handleChange?.(e.currentTarget.innerHTML)}
                // >
                //     {val}
                // </div>
                <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange?.(e.target.value)}
                    className="bg-transparent w-full hover:bg-white border border-base-400 border-solid py-2 px-1 rounded"
                />
            );
            break;

        case DynamoDataCodes.STRING_ARRAY:
        case DynamoDataCodes.NUMBER_ARRAY:
        case DynamoDataCodes.BINARY_ARRAY:
            renderer = (val: (string | number)[]) => (
                <div
                    contentEditable
                    onChange={(e) => handleChange?.(e.currentTarget.innerHTML)}
                >
                    {val.join(",")}
                </div>
            );
            break;

        case DynamoDataCodes.BOOLEAN:
            renderer = (val: boolean) => (
                <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => handleChange?.(`${e.target.checked}`)}
                />
            );
            break;

        case DynamoDataCodes.LIST:
        case DynamoDataCodes.MAP:
            renderer = (val: boolean) => (
                <>
                    <textarea
                        className="text-sm bg-transparent w-full h-full hover:bg-white border border-base-400 border-solid py-2 px-1 rounded"
                        onChange={(e) => handleChange?.(e.target.value)}
                    >
                        {JSON.stringify(val)}
                    </textarea>
                </>
            );
            break;
    }

    return renderer(dataVal);
};

export const CellRenderers = {
    dynamo: (val: AttributeValue, idx: number): ReactNode => {
        try {
            const dataType = Object.keys(val)[0] as keyof AttributeValue;
            const dataVal = val[dataType];

            const onChange = (val: string) => {
                console.log({ row: idx, val });
            };
            100;

            return renderDataType(dataType, dataVal, onChange);

            // return (
            //     <div className="flex flex-col items-start">
            //         {renderDataType(dataType, dataVal, onChange)}
            //         {/* <span>{getDataTypeFromCode(dataType)}</span> */}
            //         {/* <div className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-gray-200"></div> */}
            //     </div>
            // );
        } catch (error) {
            return <div>{JSON.stringify(error)}</div>;
        }
    },
};
