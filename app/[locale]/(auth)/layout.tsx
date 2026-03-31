import { SelectLanguage } from "@/components/common/select-language";
import { House } from "lucide-react";
import Link from "next/link";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-muted min-h-svh w-full">
            <div className="container mx-auto flex min-h-svh flex-col px-4">
                <div className="flex w-full items-center justify-between py-4">
                    <Link href="/" className="hover:text-foreground/80 transition-colors">
                        <House />
                    </Link>
                    <SelectLanguage />
                </div>
                <div className="flex flex-1 items-baseline sm:items-center justify-center">
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}