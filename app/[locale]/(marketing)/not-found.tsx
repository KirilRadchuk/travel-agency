import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("NotFound");
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-foreground">
                    {t("title")}
                </h2>
                <p className="text-muted-foreground text-lg max-w-125 mx-auto">
                    {t("description")}
                </p>
            </div>
            <Button asChild variant="default" size="lg">
                <Link href="/">
                    {t("button")}
                </Link>
            </Button>
        </div>
    );
}