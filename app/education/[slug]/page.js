import Link from "next/link";
import { notFound } from "next/navigation";
import { getEducationArticleBySlug, educationArticles } from "@/data/education";

export function generateStaticParams() {
  return educationArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function EducationDetailPage({ params }) {
  const { slug } = await params;
  const article = getEducationArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-5 py-10 text-[#332A35] sm:px-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/education"
          className="mb-8 inline-flex font-extrabold text-[#B84E73] hover:text-[#8E3E5E]"
        >
          ← Kembali ke edukasi
        </Link>

        <header className="rounded-[22px] border border-[#F0E3E9] bg-white p-6 shadow-[0_5px_24px_rgb(120_70_90_/_6%)] sm:p-9">
          <span className="inline-flex rounded-full bg-[#F8E8EF] px-3 py-1 text-sm font-extrabold text-[#B84E73]">
            {article.category}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-[#514451] sm:text-lg">
            {article.summary}
          </p>

          {article.status === "draft" && (
            <span className="mt-5 inline-flex rounded-full bg-[#FFF1D6] px-3 py-1 text-sm font-extrabold text-[#8A641E]">
              Draf · Perlu ditinjau
            </span>
          )}
        </header>

        <section className="mt-6 space-y-6 rounded-[22px] border border-[#F0E3E9] bg-white p-6 sm:p-9">
          {article.sections.map((section, index) => (
            <section key={`${article.slug}-${index}`}>
              <h2 className="text-xl font-extrabold">
                {section.heading}
              </h2>

              <div className="mt-3 space-y-4">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${article.slug}-${index}-${paragraphIndex}`}
                    className="leading-8 text-[#514451]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="mt-6 rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-6">
          <h2 className="text-lg font-extrabold">
            Batasan informasi
          </h2>

          <p className="mt-2 leading-relaxed text-[#514451]">
            {article.limitations}
          </p>
        </section>

        <p className="mt-6 text-sm leading-relaxed text-[#806D7B]">
          Informasi ini bersifat edukatif. Artikel berstatus draf belum
          melalui proses persetujuan publikasi dan tidak menggantikan
          konsultasi dengan tenaga kesehatan.
        </p>
      </article>
    </main>
  );
}