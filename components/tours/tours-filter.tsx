"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function ToursFilter({ uniqueCountries }: { uniqueCountries: string[] }) {
    const t = useTranslations("Tours")
    const router = useRouter();
    const pathname = usePathname(); 
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("countries") || "all";

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value === "all") {
            params.delete("countries")
        } else {
            params.set("countries", value)
        }
        router.push(`${pathname}?${params.toString()}`);
    }
    return (
        <Select value={currentCategory} onValueChange={handleChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder={t("select-country")} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t("title")}</SelectLabel>
                    <SelectItem value="all">{t("select-all")}</SelectItem>
                    {uniqueCountries.map((country, index) => (
                        <SelectItem value={country} key={index}>
                            {country}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}