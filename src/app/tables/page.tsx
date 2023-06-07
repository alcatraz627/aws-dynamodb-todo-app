import { getTables } from "@/utils/aws/db";

const Page = async () => {
    const { TableNames = [] } = await getTables();

    return (
        <main className="p-4">
            <div className={`m-auto max-w-4xl`}>
                <h3 className="text-3xl">Tables</h3>
                <ul className="menu rounded-box py-4 my-4 w-full h-full border border-style-solid border-blue-300 bg-base-100">
                    {TableNames.map((v) => (
                        <li key={v} className="text-lg">
                            <a href={`/tables/${v}`} className="font-mono">
                                /{v}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default Page;
