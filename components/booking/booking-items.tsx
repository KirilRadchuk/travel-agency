import { Badge } from "@/components/ui/badge"
import Image from "next/image";
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getLocale, getTranslations } from "next-intl/server";
import { getStatusVariant } from "@/lib/utils";
import BookingButton from "./booking-button";
type BookingsItemsProps = {
    booking: {
        id: string;
        status: string;
        tourDate: Date;
        tour: {
            slug: string;
            image: string;
            price: number;
            translations: {
                title: string;
                language: string;
            }[];
        };
    };
}

export default async function BookingsItems({ booking }: BookingsItemsProps) {
    const locale = await getLocale();
    const t = await getTranslations("Booking");
    const { tour, status, tourDate } = booking;

    const title = tour.translations.find(t => t.language === locale)?.title;

    const date = new Date(tourDate).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return (
        <Card className="relative pt-0 overflow-hidden">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Image
                src={tour.image}
                alt={title || t("image")}
                width={600}
                height={400}
                className="relative z-20 aspect-video w-full object-cover"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant={getStatusVariant(status)}>{t(`status.${status}`)}</Badge>
                </CardAction>
                <CardTitle>{title}
                    <p className="text-sm text-muted-foreground font-medium py-2">
                        {t("date-start", { days: date })}
                    </p>
                </CardTitle>
                <CardDescription>
                    <p className="text-md text-muted-foreground font-medium">
                        {tour.price}₴
                    </p>
                </CardDescription>
            </CardHeader>
           <BookingButton status={status} bookingId={booking.id} tourSlug={tour.slug}/>
        </Card>
    )
}
