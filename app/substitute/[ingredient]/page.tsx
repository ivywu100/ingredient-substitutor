import Script from "next/script";
import { Metadata } from "next";
import { engine } from "@/backend/SubstitutionEngine";
import { ALL_RECIPE_TYPES } from "@/backend/Ingredient";
import { ClientRedirect } from "./ClientRedirect";

// Initialize engine for static generation
engine.init();

// Generate static params for all ingredients
export async function generateStaticParams() {
  engine.init();
  const ingredients = engine.getAllIngredientNames();
  return ingredients.map((ingredient) => ({
    ingredient: ingredient,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ ingredient: string }> | { ingredient: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  engine.init();
  // Decode ingredient name (safe even if not encoded)
  let ingredient: string;
  try {
    ingredient = decodeURIComponent(resolvedParams.ingredient);
  } catch {
    ingredient = resolvedParams.ingredient;
  }
  const substitutes = engine.getSubstitutes(ingredient, ALL_RECIPE_TYPES, []);
  const substituteCount = substitutes.length;

  const title = `Substitutes for ${ingredient} in Baking | ${substituteCount} Options`;
  const description = `Find ${substituteCount} reliable substitutes for ${ingredient} in baking. Learn substitution ratios, effects on texture and flavor, and get expert baking tips.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: {
      canonical: `/substitute/${encodeURIComponent(ingredient)}`,
    },
  };
}

export default async function SubstitutePage({
  params,
}: {
  params: Promise<{ ingredient: string }> | { ingredient: string };
}) {
  const resolvedParams = await params;
  engine.init();
  
  if (!resolvedParams?.ingredient) {
    return <ClientRedirect redirectTo="/" />;
  }
  
  // Decode ingredient name (safe even if not encoded)
  let ingredient: string;
  try {
    ingredient = decodeURIComponent(resolvedParams.ingredient);
  } catch {
    ingredient = resolvedParams.ingredient;
  }
  
  // Verify ingredient exists
  const substitutes = engine.getSubstitutes(ingredient, ALL_RECIPE_TYPES, []);
  
  // Build redirect URL with query parameters
  const paramsObj = new URLSearchParams({
    ingredient: ingredient,
    recipes: ALL_RECIPE_TYPES.join(","),
  });
  const redirectUrl = `/?${paramsObj.toString()}`;

  // Format substitution amounts for display
  const formatAmount = (amount: { quantity: number; unit: string }) => {
    const qty = amount.quantity % 1 === 0 
      ? amount.quantity.toString() 
      : amount.quantity.toFixed(2).replace(/\.?0+$/, '');
    return `${qty} ${amount.unit}`.trim();
  };

  // Build structured data for SEO (only if we have substitutes)
  const faqSchema = substitutes.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: substitutes.map((sub) => ({
      "@type": "Question",
      name: `What can I substitute for ${ingredient}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${sub.name}: ${sub.instructions || `Use ${sub.substitution.map(formatAmount).join(" + ")} instead of ${formatAmount(sub.baseAmount)}.`}`,
      },
    })),
  } : null;

  const articleSchema = substitutes.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Substitutes for ${ingredient} in Baking`,
    description: `Complete guide to substituting ${ingredient} in baking recipes with ${substitutes.length} reliable options.`,
    author: {
      "@type": "Organization",
      name: "Baking Ingredient Substitution Engine",
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Substitutes for ${ingredient}`,
        item: `/substitute/${encodeURIComponent(ingredient)}`,
      },
    ],
  };

  const howToSchema = substitutes.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Substitute ${ingredient} in Baking`,
    description: `Learn how to substitute ${ingredient} in your baking recipes.`,
    step: substitutes.map((sub, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Substitute with ${sub.name}`,
      text: `${sub.instructions || `Replace ${formatAmount(sub.baseAmount)} with ${sub.substitution.map(formatAmount).join(" + ")}.`}`,
    })),
  } : null;

  return (
    <>
      {/* Structured data for SEO - rendered before client redirect */}
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      {articleSchema && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {howToSchema && (
        <Script
          id="howto-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
      
      {/* Client-side redirect component */}
      <ClientRedirect redirectTo={redirectUrl} />
    </>
  );
}
