import type { Metadata } from "next";;
import { Open_Sans } from "next/font/google";
import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import { cx } from "@/utils/style";
import { getTables } from "@/utils/aws/db";
import Link from "next/link";
import "../style/globals.css"

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Personal Tracker",
    icons: ["/favicon.jpg"],
    description: "Dummy todo app by alcatraz627",
    authors: {
        name: "Aakarsh Chopra",
        url: "https://github.com/alcatraz627",
    } as Author,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { TableNames = [] } = await getTables();

    return (
        <html lang="en">
            <body
                className={cx(
                    open_sans.className,
                    "flex flex-col h-screen"
                    // "border-2 border-red-500 border-solid"
                )}
            >
                <nav className="w-full text-white bg-blue-700 bg-opacity-80 p-4 border-0 border-purple-700 border-solid border-opacity-50">
                    <div className="flex flex-row justify-between">
                        <h3>Personal Tracker</h3>
                        {TableNames.map((name) => (
                            <Link key={name} href={`/tables/${name}`}>
                                /{name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {children}
            </body>
        </html>
    );
}
