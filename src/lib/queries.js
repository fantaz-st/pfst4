const SEO_FIELDS = /* GraphQL */ `
  fragment SeoFields on ContentNode {
    seo {
      title
      metaDesc
      canonical
      opengraphImage {
        sourceUrl
      }
    }
  }
`;

const PAGE_FIELDS = /* GraphQL */ `
  fragment PageFields on Page {
    id
    title
    uri
    contentTypeName
    ...SeoFields
    language {
      code
      slug
    }
    translations {
      language {
        code
      }
      uri
      title
    }
    ancestors {
      nodes {
        ... on Page {
          id
          title
          uri
        }
      }
    }
    parent {
      node {
        ... on Page {
          id
          children {
            nodes {
              ... on Page {
                id
                title
                uri
              }
            }
          }
        }
      }
    }
    children {
      nodes {
        ... on Page {
          id
          title
          uri
        }
      }
    }
    blocks(attributes: true, dynamicContent: true)
  }
`;

const POST_FIELDS = /* GraphQL */ `
  fragment PostFields on Post {
    id
    title
    uri
    date
    excerpt
    contentTypeName
    ...SeoFields
    language {
      code
      slug
    }
    translations {
      language {
        code
      }
      uri
      title
    }
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    categories(first: 10) {
      nodes {
        name
        slug
      }
    }
    ciljevi(first: 10) {
      nodes {
        name
        slug
      }
    }
    blocks(attributes: true, dynamicContent: true)
  }
`;

export const NODE_BY_URI = /* GraphQL */ `
  query NodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ...PageFields
      ...PostFields
    }
  }
  ${SEO_FIELDS}
  ${PAGE_FIELDS}
  ${POST_FIELDS}
`;

// nodeByUri has no asPreview argument, so previewing a draft — which has no
// stable uri yet — goes through the singular page/post query by database ID.
export const PREVIEW_PAGE = /* GraphQL */ `
  query PreviewPage($id: ID!) {
    page(id: $id, idType: DATABASE_ID, asPreview: true) {
      __typename
      ...PageFields
    }
  }
  ${SEO_FIELDS}
  ${PAGE_FIELDS}
`;

export const PREVIEW_POST = /* GraphQL */ `
  query PreviewPost($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      __typename
      ...PostFields
    }
  }
  ${SEO_FIELDS}
  ${POST_FIELDS}
`;

// The "main" menu (WPGraphQL Polylang gives every language its own menu
// assigned to the same location). Polylang/WPGraphQL Polylang don't support
// filtering by language through menu(id, idType) — only the root menuItems
// connection takes a language where-arg — so this queries menu items
// directly by location rather than going through menu(id: "main").
export const MENU_ITEMS = /* GraphQL */ `
  query MenuItems($language: LanguageCodeFilterEnum, $after: String) {
    menuItems(
      first: 100
      after: $after
      where: { location: SECONDARY_MENU, language: $language }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        parentDatabaseId
        label
        path
      }
    }
  }
`;

// Lightweight lookup for the Header's language switcher, which lives in the
// root layout and has no access to the current page's full NODE_BY_URI node.
export const TRANSLATIONS_BY_URI = /* GraphQL */ `
  query TranslationsByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        translations {
          language {
            code
          }
          uri
          title
        }
      }
      ... on Post {
        translations {
          language {
            code
          }
          uri
          title
        }
      }
    }
  }
`;

// categories are translatable per-language in Polylang, so they take a
// language filter. ciljevi is not registered as a translatable taxonomy
// (RootQueryToCiljConnectionWhereArgs has no language field) — the same set
// of terms is shared across languages, so it never takes one.
export const NEWS_TAXONOMIES = /* GraphQL */ `
  query NewsTaxonomies($language: LanguageCodeFilterEnum) {
    categories(first: 100, where: { language: $language }) {
      nodes {
        id
        name
        slug
        count
      }
    }
    ciljevi(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// "istaknuto" is a Croatian category; WordPress won't let a translated term
// reuse its slug, so the English equivalent (once an editor creates one) has
// to be looked up via Category.translation rather than assumed.
export const FEATURED_CATEGORY_TRANSLATION = /* GraphQL */ `
  query FeaturedCategoryTranslation($language: LanguageCodeEnum!) {
    category(id: "istaknuto", idType: SLUG) {
      translation(language: $language) {
        slug
      }
    }
  }
`;

export const NEWS_POSTS = /* GraphQL */ `
  query NewsPosts(
    $first: Int!
    $after: String
    $where: RootQueryToPostConnectionWhereArgs
  ) {
    posts(first: $first, after: $after, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        uri
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories(first: 10) {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const CILJ_TERM = /* GraphQL */ `
  query CiljTerm($slug: ID!) {
    cilj(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
    }
  }
`;

// language: ALL is required — without it WPGraphQL Polylang defaults to the
// site's default language only, which would silently drop English content
// from generateStaticParams and the sitemap.
export const ALL_CONTENT_URIS = /* GraphQL */ `
  query AllContentUris($first: Int!, $after: String) {
    contentNodes(
      first: $first
      after: $after
      where: { contentTypes: [PAGE, POST], status: PUBLISH, language: ALL }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        uri
        contentTypeName
        modifiedGmt
      }
    }
  }
`;
