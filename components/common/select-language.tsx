"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function SelectLanguage() {
  const local = useLocale();
  const locales = routing.locales;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocal: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocal })
    })
  }
  return (
    <Select value={local} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue placeholder={local} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((local) => (
            <SelectItem value={local} key={local}>{local}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
