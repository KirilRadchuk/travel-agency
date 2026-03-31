import { auth } from "@/auth";
import BookingsItems from "@/components/booking/booking-items";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Booking.Metadata" })
    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function BookingsPage() {
    const session = await auth();
    const locale = await getLocale()

    if (!session?.user.email) {
        redirect({ href: "/login", locale })
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: session?.user.id },
        orderBy: {
            tourDate: 'asc'
        },
        include: {
            tour: {
                include: {
                    translations: true
                }
            }
        }
    })
    return <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
            <BookingsItems key={booking.id} booking={booking} />
        ))}
    </div>
}


