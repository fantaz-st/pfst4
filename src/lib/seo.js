// Metadata for every route. Yoast is installed but almost nothing is filled
// in, so the fallback chains here are the primary path, not a safety net.
// Canonicals and every absolute URL are built from NEXT_PUBLIC_SITE_URL —
// never passed through from WordPress (its links point at backend.pfst.hr).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const SITE = {
  hr: {
    name: "Pomorski fakultet u Splitu",
    description:
      "Pomorski fakultet Sveučilišta u Splitu — studiji pomorske nautike, brodostrojarstva, pomorskih elektrotehničkih i informatičkih tehnologija te pomorskog menadžmenta.",
    locale: "hr_HR",
    home: "/",
  },
  en: {
    name: "Faculty of Maritime Studies, University of Split",
    description:
      "Faculty of Maritime Studies, University of Split — nautical studies, marine engineering, marine electrical and information technologies, and maritime management.",
    locale: "en_GB",
    home: "/en/",
  },
};

export const SHORT_NAME = "PFST";

// PFST modra (Pantone 662 C). Browser UI colour only: the address bar on
// mobile, the manifest. Components still take colours from tokens.css.
export const BRAND_COLOR = "#00246F";
export const BACKGROUND_COLOR = "#F1F4F8";

// Fallback share image (public/og-default.png, 1200×630): official logo on
// modra with the signal-flag band. Used whenever a page has neither a Yoast
// OG image nor a featured image.
const DEFAULT_OG_IMAGE = { url: "/og-default.png", width: 1200, height: 630 };

// Staging / preview deployments set SITE_NOINDEX=true so they never compete
// with the live site in search results.
export const NOINDEX = process.env.SITE_NOINDEX === "true";

// WordPress uris end in "/", but next.config has no `trailingSlash`, so Next
// 308-redirects "/novosti/x/" to "/novosti/x". Canonicals, hreflang, OG urls
// and the sitemap must point at the URL that actually answers 200.
export function toAbsoluteUrl(uri = "/") {
  const path = uri.length > 1 ? uri.replace(/\/+$/, "") : uri;
  return `${SITE_URL}${path}`;
}
const absolute = toAbsoluteUrl;

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLength = 155) {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export function buildMetaDescription(node) {
  if (node.seo?.metaDesc) return node.seo.metaDesc;

  if (node.excerpt) {
    const cleaned = stripHtml(node.excerpt);
    if (cleaned) return truncate(cleaned);
  }

  const firstParagraph = node.blocks?.find(
    (block) => block.name === "core/paragraph" && block.attributes?.content?.trim(),
  );
  if (firstParagraph) {
    const cleaned = stripHtml(firstParagraph.attributes.content);
    if (cleaned) return truncate(cleaned);
  }

  return undefined;
}

// Builds the { languages } map for Next's metadata `alternates`, which
// renders <link rel="alternate" hreflang="..."> tags. Undefined when the
// page has no translations, so the catch-all doesn't emit a single-entry
// hreflang set that's meaningless on its own.
export function buildLanguageAlternates(node) {
  if (!node.translations?.length) return undefined;

  const languages = {};

  const addEntry = (code, uri) => {
    if (code && uri) languages[code.toLowerCase()] = absolute(uri);
  };

  addEntry(node.language?.code, node.uri);
  for (const translation of node.translations) {
    addEntry(translation.language?.code, translation.uri);
  }

  const croatianUri =
    node.language?.code === "HR"
      ? node.uri
      : node.translations.find((t) => t.language?.code === "HR")?.uri;
  languages["x-default"] = absolute(croatianUri ?? node.uri);

  return languages;
}

// Yoast returns an auto-generated title ("Naslov - Naziv weba") even when
// nobody wrote one. Only a title an editor actually customised — one that
// doesn't start with the post/page title — replaces ours; everything else
// gets the site's own "%s — Pomorski fakultet u Splitu" template.
function pickTitle(node) {
  const yoast = node.seo?.title?.trim();
  if (yoast && node.title && !yoast.startsWith(node.title)) {
    return { absolute: yoast };
  }
  return node.title;
}

function nodeImages(node) {
  const yoast = node.seo?.opengraphImage?.sourceUrl;
  if (yoast) return [{ url: yoast }];
  const featured = node.featuredImage?.node;
  if (featured?.sourceUrl) {
    return [{ url: featured.sourceUrl, alt: featured.altText || node.title }];
  }
  return undefined;
}

// Root layout metadata — inherited by every route in that language.
export function buildRootMetadata(language) {
  const site = SITE[language];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.name, template: `%s — ${site.name}` },
    description: site.description,
    applicationName: site.name,
    publisher: site.name,
    category: "education",
    formatDetection: { telephone: false, email: false, address: false },
    appleWebApp: { title: SHORT_NAME, statusBarStyle: "default" },
    robots: NOINDEX
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
    openGraph: buildOpenGraph({ language, uri: site.home, title: site.name, description: site.description }),
    twitter: buildTwitter({ title: site.name, description: site.description }),
    // icon.svg, favicon.ico, apple-icon.png and manifest.js in app/ are
    // picked up by Next's file conventions — nothing to declare here.
  };
}

export const rootViewport = {
  themeColor: BRAND_COLOR,
  colorScheme: "light",
};

// openGraph and twitter are replaced, not merged, when a child route sets
// them — so every route goes through these builders and always carries
// siteName, locale and an image.
function buildOpenGraph({ language, uri, title, description, type = "website", images, article }) {
  const site = SITE[language];
  const other = language === "hr" ? SITE.en : SITE.hr;
  return {
    type,
    url: absolute(uri),
    siteName: site.name,
    locale: site.locale,
    alternateLocale: [other.locale],
    title,
    description,
    images: images?.length ? images : [{ ...DEFAULT_OG_IMAGE, alt: site.name }],
    ...article,
  };
}

function buildTwitter({ title, description, images }) {
  return {
    card: "summary_large_image",
    title,
    description,
    images: images?.length ? images.map((image) => image.url) : [DEFAULT_OG_IMAGE.url],
  };
}

// Static routes (home, news archive, search, 404, styleguide).
// `title` may be a string (gets the template) or { absolute }.
export function buildPageMetadata({ language, uri, title, description, languages, noindex = false }) {
  const site = SITE[language];
  const plainTitle = typeof title === "object" ? title.absolute : title;
  const desc = description ?? site.description;
  return {
    title,
    description: desc,
    alternates: { canonical: absolute(uri), languages },
    openGraph: buildOpenGraph({ language, uri, title: plainTitle, description: desc }),
    twitter: buildTwitter({ title: plainTitle, description: desc }),
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

// The [...slug] catch-all: WordPress pages and posts.
export function buildContentMetadata(node, language) {
  const site = SITE[language];
  const title = pickTitle(node);
  const plainTitle = typeof title === "object" ? title.absolute : title;
  const description = buildMetaDescription(node) ?? site.description;
  const images = nodeImages(node);
  const isPost = node.__typename === "Post";

  const article = isPost
    ? {
        publishedTime: node.date,
        modifiedTime: node.modified ?? node.date,
        authors: node.author?.node?.name ? [node.author.node.name] : undefined,
        section: node.categories?.nodes?.[0]?.name,
        tags: node.tags?.nodes?.map((tag) => tag.name),
      }
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absolute(node.uri),
      languages: buildLanguageAlternates(node),
    },
    openGraph: buildOpenGraph({
      language,
      uri: node.uri,
      title: plainTitle,
      description,
      type: isPost ? "article" : "website",
      images,
      article,
    }),
    twitter: buildTwitter({ title: plainTitle, description, images }),
  };
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD), rendered by components/seo/JsonLd.jsx.

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd(language) {
  const site = SITE[language];
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "@id": ORGANIZATION_ID,
    name: site.name,
    alternateName: SHORT_NAME,
    url: absolute(site.home),
    logo: absolute("/icons/icon-512.png"),
    image: absolute(DEFAULT_OG_IMAGE.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ruđera Boškovića 37",
      postalCode: "21000",
      addressLocality: "Split",
      addressCountry: "HR",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: language === "hr" ? "Sveučilište u Splitu" : "University of Split",
      url: "https://www.unist.hr",
    },
    // From the live site's footer. TODO: keep in sync with siteLinks.js once
    // the Facebook TODO there is filled in.
    sameAs: ["https://www.facebook.com/pfst.hr"],
  };
}

export function contentJsonLd(node, language) {
  const site = SITE[language];
  const url = absolute(node.uri);

  if (node.__typename === "Post") {
    const image = nodeImages(node)?.[0]?.url;
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: node.title,
      description: buildMetaDescription(node),
      url,
      mainEntityOfPage: url,
      inLanguage: language,
      datePublished: node.date,
      dateModified: node.modified ?? node.date,
      image: image ? [image] : [absolute(DEFAULT_OG_IMAGE.url)],
      author: node.author?.node?.name
        ? { "@type": "Person", name: node.author.node.name }
        : { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
      articleSection: node.categories?.nodes?.[0]?.name,
      keywords: node.tags?.nodes?.map((tag) => tag.name).join(", ") || undefined,
    };
  }

  // Pages: breadcrumb trail = home, ancestors (root first), current page.
  const ancestors = [...(node.ancestors?.nodes ?? [])].reverse();
  const trail = [
    { name: language === "hr" ? "Početna" : "Home", uri: site.home },
    ...ancestors.map((item) => ({ name: item.title, uri: item.uri })),
    { name: node.title, uri: node.uri },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.uri),
    })),
  };
}
