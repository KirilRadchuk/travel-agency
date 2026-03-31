import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";

type ToursItemsProps = {
    tours: {
        image: string;
        id: string;
        price: number;
        slug: string;
        duration: number;
        translations: {
            language: string;
            title: string;
            country: string;
            description: string;
        }[];
        dates: {
            id: string;
            date: Date;
        }[];
    };
};

export default async function UpcomingTours({ tours }: ToursItemsProps) {
    const locale = await getLocale();
    const t = await getTranslations("Tours");
    const tour = tours.translations.find((t) => t.language === locale);
    const nextDate = tours.dates[0]?.date;
    const formattedDate = nextDate
        ? new Date(nextDate).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : null;

    return (
        <div className="border-t w-full py-6">
            <div className="flex flex-col 2xl:flex-row justify-center gap-4">
                <div className="flex flex-col xl:flex-row gap-4 items-center lg:items-start w-full md:w-auto">
                    <div className="relative w-full xl:w-50 h-30 shrink-0 overflow-hidden bg-gray-100 rounded-lg flex items-center justify-center">
                        {tours.image ? (
                            <Image
                                src={tours.image}
                                alt={tour?.title || t("image")}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 200px"
                            />
                        ) : (
                            <MapPin className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div className="lg:text-left text-center alig-">
                        <h2 className="text-lg font-semibold mb-2">
                            {tour?.title}
                        </h2>
                        {formattedDate && (
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <span>{t("next_tour")}: <span className="font-medium text-foreground">{formattedDate}</span></span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-center w-full md:w-auto mt-2 md:mt-0">
                    <Button variant={"link"} asChild>
                        <Link href={`tours/${tours.slug}`} >
                            {t("detail-button")}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}