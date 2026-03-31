"use client"
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { Link } from "@/i18n/navigation";
import { cancelBooking } from "@/actions/booking";
import { toast } from "sonner";
import { useTransition } from "react";

type BookingButtonProps = {
    bookingId: string;
    tourSlug: string;
    status: string;
}

export default function BookingButton({ bookingId, tourSlug, status }: BookingButtonProps) {
    const t = useTranslations("Booking")
    const canCancel = status === "PENDING" || status === "CONFIRMED";
    const [isPending, startTransition] = useTransition();

    async function handleCancel() {
        startTransition(async () => {
            const result = await cancelBooking(bookingId);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(t("cancel_success"));
            }
        });
    }
    return <CardFooter className="w-full flex flex-col md:flex-row items-center gap-3 pt-4">
        <Button variant="outline" className="w-full md:w-auto" asChild>
            <Link href={`/tours/${tourSlug}`}>
                {t("view_tour")}
            </Link>
        </Button>
        {canCancel && (
            <div
                className="w-full md:w-auto md:ml-auto"
            >
                <Button variant="destructive" className="w-full md:w-auto" onClick={handleCancel} disabled={isPending}>
                    {isPending ? t("cancelling") : t("button-cancel")}
                </Button>
            </div>
        )}
    </CardFooter>
}