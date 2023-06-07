/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import { cx } from "@/utils/style";
import { getTables } from "@/utils/aws/db";
import "../style/globals.css";
import { Navbar, NavbarProps } from "@/components/navbar/navbar.component";
import Image from "next/image";
import { NavbarLink } from "@/components/navbar/navbar-link.component";

const font = Noto_Sans({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "Personal Tracker",
    icons: ["/favicon.jpg"],
    description: "Dummy todo app by alcatraz627",
    authors: {
        name: "Aakarsh Chopra",
        url: "https://github.com/alcatraz627",
    } as Author,
    viewport: "width=device-width, initial-scale=1.0",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links: NavbarProps["links"] = [
        {
            content: (
                <NavbarLink
                    iconUrl="/icons/table.svg"
                    text="Tables"
                    iconProps={{ className: "w-6" }}
                />
            ),
            href: "/tables",
        },
        {
            content: (
                <NavbarLink
                    iconUrl="/icons/column.svg"
                    text="Schemas"
                    iconProps={{ className: "w-6" }}
                />
            ),
            href: "/schemas",
        },
    ];

    return (
        <html lang="en" data-theme="emerald">
            <body
                className={cx(
                    font.className,
                    "flex flex-col h-screen",
                    "bg-white"
                    // "border-2 border-red-500 border-solid"
                )}
            >
                <Navbar title="Personal Tracker" links={links} />

                {children}
            </body>
        </html>
    );
}
