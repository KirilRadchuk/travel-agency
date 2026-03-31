import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Globe2, ShieldCheck, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UpcomingTours from "@/components/templates/upcoming-tours";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.Metadata"})
  return {
    title: t("title"),
    description: t("description")
  }
}

export default async function HomePage() {
  const t = await getTranslations("Home");
  const upcomingTours = await prisma.tour.findMany({
    take: 3,
    include: {
      translations: true,
      dates: {
        orderBy: {
          date: 'asc'
        },
        where: {
          date: {
            gte: new Date()
          }
        }
      }
    },
    where: {
      dates: {
        some: {
          date: {
            gte: new Date()
          }
        }
      }
    }
  });
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative w-full py-20  flex items-center justify-center overflow-hidden rounded-2xl px-4">
        <div className="container relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="text-lg">
            Travel Agency
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            {t("Hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t("Hero.subtitle")}
          </p>
          <div className="mt-4">
            <Button size="lg" asChild className="font-semibold text-md px-8 py-6 rounded-full">
              <Link href="/tours">
                {t("Hero.button")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t("Features.title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Globe2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("Features.items.expert.title")}</h3>
            <p className="text-muted-foreground">{t("Features.items.expert.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("Features.items.price.title")}</h3>
            <p className="text-muted-foreground">{t("Features.items.price.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("Features.items.support.title")}</h3>
            <p className="text-muted-foreground">{t("Features.items.support.description")}</p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{t("Popular.title")}</h2>
        {upcomingTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTours.map((tour) => (
              <UpcomingTours key={tour.id} tours={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground border rounded-2xl bg-muted/20">
            {t("Popular.none-available")}
          </div>
        )}
        <div className="flex justify-center">
          <div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/tours">{t("Popular.button_more")}</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}