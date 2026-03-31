import { Link } from "@/i18n/navigation";
import { Plane, UserRoundPen, Ticket } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SelectLanguage } from "@/components/common/select-language";
import { auth } from "@/auth";

export default async function Header() {
    const session = await auth();
    const t = await getTranslations("Header");
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Plane className="h-6 w-6" />
                    <span className="text-lg font-bold tracking-tight hidden sm:block">
                        {t("title")}
                    </span>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/tours" className="text-sm font-medium transition-colors hover:text-primary hover:underline underline-offset-4 decoration-2">
                        {t("tours")}
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <Link href="/bookings" title={t("booking")} className="text-muted-foreground hover:text-foreground transition-colors">
                                <Ticket className="h-5 w-5" />
                            </Link>
                            <Link href="/profile" title={t("profile")} className="text-muted-foreground hover:text-foreground transition-colors">
                                <UserRoundPen className="h-5 w-5" />
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4 decoration-2 transition-colors">
                            {t("login")}
                        </Link>
                    )}
                    <SelectLanguage />
                </div>
            </div>
        </header>
    );
}