import { auth, signOut } from "@/auth";
import ProfileForm from "@/components/user/profile/profile-form";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Profile.Metadata" })
    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function ProfilePage() {
    const session = await auth();
    const locale = await getLocale();
    if (!session?.user.email) {
        redirect({ href: "/login", locale: locale })
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user.email
        }
    })
    if (!user) {
        return <p>Користувача не знайдено</p>;
    }
    const userField = {
        name: user.name,
        email: user.email,
        image: user.image,
    }
    async function logOut() {
        "use server"
        await signOut();
        redirect({ href: "/", locale: locale })
    }
    return <>
        <ProfileForm user={userField} logOut={logOut} />
    </>
}