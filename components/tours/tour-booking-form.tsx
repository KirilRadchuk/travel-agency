"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TourBookingFormProps } from "@/lib/validators";
import { booking } from "@/actions/booking";
import { handleServerResponse } from "@/lib/utils"; 

export function TourBookingForm({ tourId, dates}: TourBookingFormProps) {
    const t = useTranslations("Tours");
    const locale = useLocale();
    const FormSchema = z.object({
        dateId: z.string().min(1, {
            message: t("date_required")
        }),
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dateId: "",
        },
    });
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await booking({
            tourId,
            dateId: data.dateId, 
        });
        handleServerResponse(result, form, () => {
            toast.success(t("booking_success"));    
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="dateId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-center">{t("select_date_label")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={dates.length > 0 ? t("select_date_placeholder") : t("no_dates_available")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {dates.length > 0 ? (
                                        dates.map((dateItem) => {
                                            const formattedDate = new Date(dateItem.date).toLocaleDateString(
                                                locale,
                                                { day: 'numeric', month: 'long', year: 'numeric' }
                                            );
                                            return (
                                                <SelectItem key={dateItem.id} value={dateItem.id}>
                                                    {formattedDate}
                                                </SelectItem>
                                            );
                                        })
                                    ) : (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            {t("no_dates_available")}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={dates.length === 0 || form.formState.isSubmitting}
                >
                    {t("booking-button")}
                </Button>
            </form>
        </Form>
    );
}