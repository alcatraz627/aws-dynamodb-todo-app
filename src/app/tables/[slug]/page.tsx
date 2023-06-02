import { getTableData } from "@/utils/aws/db";

export default async function Page({ params }: { params: { slug: string } }) {
    const data = await getTableData(params.slug);

    return (
        <main className="p-4">
            <div className="bg-gray-100 m-auto max-w-4xl p-2">
                <div className="text-lg">{params.slug}</div>
                <hr className="my-2" />
                <pre>{JSON.stringify(data.Items, undefined, 4)}</pre>
            </div>
        </main>
    );
}
