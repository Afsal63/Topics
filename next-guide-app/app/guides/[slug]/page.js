import { notFound } from "next/navigation";
import GuidePageClient from "../../../components/GuidePageClient.js";
import { getAllGuides, getGuideBySlug } from "../../../lib/guide-parser.js";

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  return {
    title: `${guide.navLabel} Guide`,
    description: guide.headerSubText,
  };
}

export default async function GuideRoute({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const guides = getAllGuides().map((item) => ({
    slug: item.slug,
    navLabel: item.navLabel,
  }));

  return <GuidePageClient guide={guide} guides={guides} />;
}
