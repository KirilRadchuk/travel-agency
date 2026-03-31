import { Metadata } from "next";
import ToursFilter from "@/components/tours/tours-filter";
import ToursItems from "@/components/tours/tours-items";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma"
import { getLocale, getTranslations } from "next-intl/server"
type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ countries?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params;
    const { countries } = await searchParams;
    const t = await getTranslations({ locale, namespace: "Tours.Metadata" });
    const title = countries && countries !== "all"
        ? t("country_title", { country: countries })
        : t("title");
    return {
        title,
        description: t("description")
    }
}

export default async function ToursPage({ searchParams }: { searchParams: Promise<{ countries?: string }> }) {
    const locale = await getLocale();
    const t = await getTranslations("Tours");
    const { countries } = await searchParams;
    const whereClause: Prisma.TourWhereInput = (countries && countries !== "all")
        ? {
            translations: {
                some: {
                    language: locale,
                    country: countries
                }
            }
        }
        : {};
    const [allCountryTranslations, tours] = await Promise.all([
        prisma.tourTranslation.findMany({
            where: {
                language: locale,
            },
            select: {
                country: true
            },
            distinct: ['country']
        }),
        prisma.tour.findMany({
            where: whereClause,
            include: {
                translations: true,
                dates: {
                    orderBy: {
                        date: 'asc'
                    },
                    where: {
                        date: {
                            gte: new Date()
                        },
                    }
                }
            }
        })
    ]);
    const uniqueCountries = allCountryTranslations
        .map(t => t.country)
        .filter(Boolean);
    return <div>
        <div className="border w-full my-8 p-6 ">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{t("title")}</h1>
                <ToursFilter uniqueCountries={uniqueCountries} />
            </div>
        </div>
        {tours.map((tour) => {
            return (
                <ToursItems key={tour.id} tours={tour} />
            )
        })}
    </div>
}