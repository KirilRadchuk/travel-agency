"use client"
import { useState } from "react"
import { cn, handleServerResponse } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useForm } from "react-hook-form"
import { login, loginWithGoogle } from "@/actions/auth"
import z from "zod"
import { BaseLoginSchema, getLoginSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod";

type FormFields = z.infer<typeof BaseLoginSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const authT = useTranslations("Auth.Errors");
    const t = useTranslations("LoginForm");
    const [serverError, setServerError] = useState<string | null>(null);
    const loginSchema = getLoginSchema(authT);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<FormFields>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: FormFields) {
        setServerError(null);
        const result = await login(data);
       handleServerResponse(result, { setError, reset })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t("title")}</CardTitle>
                    <CardDescription>
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <Button variant="outline" type="button" onClick={() => loginWithGoogle()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    {t("google-button")}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                {t("field-separator")}
                            </FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                                </div>
                                <Input id="password" type="password" {...register("password")}
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </Field>
                            {serverError && (
                                <p className="text-red-500 text-sm">
                                    {serverError}
                                </p>
                            )}
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "..." : t("login-button")}
                                </Button>
                                <FieldDescription className="text-center">
                                    {t("not-account")} <Link href="/register">{t("sign-up")}</Link>
                                </FieldDescription>
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}