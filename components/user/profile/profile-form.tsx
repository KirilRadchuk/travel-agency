"use client"

import { profileUpdate } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { handleServerResponse } from "@/lib/utils"
import { BaseProfileSchema, getProfileSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useForm } from "react-hook-form"
import z from "zod"

type ProfileUser = {
    name: string | null,
    email: string | null,
    image: string | null
}

type ProfileUserForm = {
    user: ProfileUser,
    logOut: () => void
}

type FormFields = z.infer<typeof BaseProfileSchema>;

export default function ProfileForm({ user, logOut }: ProfileUserForm) {
    const t = useTranslations("Profile")
    const authT = useTranslations("Auth.Errors");

    const profileSchema = getProfileSchema(authT)

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
    });

    async function onSubmit(data: FormFields) {
        const result = await profileUpdate(data);
        handleServerResponse(result, { setError, reset })
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldSet>
                    <div className="mb-8">
                        <FieldLegend className="text-2xl font-bold">{t("title")}</FieldLegend>
                        <FieldDescription className="text-base mt-1">{t("description")}</FieldDescription>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
                        <div className="flex-1">
                            <FieldGroup className="space-y-4">

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
                                        <FieldDescription>{t("name_description")}</FieldDescription>
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                    </FieldContent>
                                    <Input id="name" {...register("name")} />
                                </Field>

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                                        <FieldDescription>{t("email_description")}</FieldDescription>
                                    </FieldContent>
                                    <Input id="email" defaultValue={user.email || ""} disabled className="opacity-60 cursor-not-allowed" />
                                </Field>

                                <hr className="border-t border-border/50 my-4" />

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="currentPassword">{t("current_password")}</FieldLabel>
                                        <FieldDescription>{t("current_password_description")}</FieldDescription>
                                        {errors.currentPassword && <p className="text-red-500 text-sm mt-1 font-medium">{errors.currentPassword.message}</p>}
                                    </FieldContent>
                                    <Input id="currentPassword" type="password" {...register("currentPassword")} />
                                </Field>

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="newPassword">{t("new_password")}</FieldLabel>
                                        <FieldDescription>{t("new_password_description")}</FieldDescription>
                                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                                    </FieldContent>
                                    <Input id="newPassword" type="password" {...register("newPassword")} />
                                </Field>

                                <Field orientation="responsive">
                                    <FieldContent>
                                        <FieldLabel htmlFor="confirmNewPassword">{authT("password_required")}</FieldLabel>
                                        <FieldDescription>Повторіть новий пароль</FieldDescription>
                                        {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword.message}</p>}
                                    </FieldContent>
                                    <Input id="confirmNewPassword" type="password" {...register("confirmNewPassword")} />
                                </Field>

                                <Field orientation="responsive" className="pt-6">
                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {t("button_update")}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={logOut}>
                                            {t("button_log_out")}
                                        </Button>
                                    </div>
                                </Field>

                            </FieldGroup>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="md:border-l md:border-border/40 md:pl-10 h-full flex flex-col items-center justify-start py-2">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-linear-to-br from-primary/20 to-primary/0 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="relative overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={t("profile_image")}
                                                className="object-cover h-40 w-40 md:h-48 md:w-48 bg-muted"
                                                width={200}
                                                height={200}
                                                priority
                                            />
                                        ) : (
                                            <div className="h-40 w-40 md:h-48 md:w-48 bg-muted flex items-center justify-center">
                                                <User className="w-20 h-20 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground font-medium">{t("profile_image")}</p>
                            </div>
                        </div>
                    </div>
                </FieldSet>
            </form>
        </div>
    )
}