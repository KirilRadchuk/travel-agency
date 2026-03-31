import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma"
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { TourBookingForm } from "@/components/tours/tour-booking-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "Booking.TourMetadata" });
    const tour = await prisma.tour.findUnique({
        where: {
            slug
        },
        include: {
            translations: {
                where: { language: locale },
                select: {
                    title: true
                }
            }
        }
    })
    const tourName = tour?.translations[0]?.title || slug
    return {
        title: t("title", { name: tourName }),
        description: t("description", { name: tourName })
    }
}

export default async function DetailsTourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations("Tours");

    const tour = await prisma.tour.findUnique({
        where: {
            slug
        },
        include: {
            translations: true,
            dates: {
                where: {
                    date: { gte: new Date() }
                },
                orderBy: {
                    date: 'asc'
                }
            }
        }
    })
    if (!tour) {
        notFound()
    }
    const tourTranslate = tour?.translations.find((t) => t.language === locale)
    return (
        <Card className="relative mx-auto w-full max-w-md pt-0 overflow-hidden">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Image
                src={tour.image}
                alt={tourTranslate?.title || t("image")}
                width={600}
                height={400}
                className="relative z-20 aspect-video w-full object-cover"
            />
            <CardHeader>
                <CardTitle>
                    {tourTranslate?.title}
                    <p className="text-sm text-muted-foreground font-medium py-2">
                        {t("duraction", { days: tour.duration })}
                    </p>
                </CardTitle>
                <div className="flex justify-between items-center mb-2">
                    <CardAction>
                        <Badge variant="secondary">{tour.price} ₴</Badge>
                    </CardAction>
                </div>
                <CardDescription>
                    {tourTranslate?.description}
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col pt-0">
                <TourBookingForm
                    tourId={tour.id}
                    dates={tour.dates}
                    price={tour.price}
                />
            </CardFooter>
        </Card>
    )
}