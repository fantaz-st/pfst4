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

// Page children follow Page Attributes → Order in WordPress, then title.
const CHILD_ORDER = /* GraphQL */ `where: { orderby: [{ field: MENU_ORDER, order: ASC }, { field: TITLE, order: ASC }] }`;

const PAGE_FIELDS = /* GraphQL */ `
  fragment PageFields on Page {
    id
    title
    uri
    modified
    contentTypeName
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
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
          children(first: 100, ${CHILD_ORDER}) {
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
    children(first: 100, ${CHILD_ORDER}) {
      nodes {
        ... on Page {
          id
          title
          uri
          seo {
            metaDesc
          }
        }
      }
    }
    blocks(attributes: true, dynamicContent: true)
  }
`;

// The sidebar tree (design/reference/page.html): a section's root page and
// three levels below it.
export const SECTION_TREE = /* GraphQL */ `
  query SectionTree($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page {
        id
        title
        uri
        children(first: 100, ${CHILD_ORDER}) {
          nodes {
            ... on Page {
              id
              title
              uri
              children(first: 100, ${CHILD_ORDER}) {
                nodes {
                  ... on Page {
                    id
                    title
                    uri
                    children(first: 100, ${CHILD_ORDER}) {
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
            }
          }
        }
      }
    }
  }
`;

const POST_FIELDS = /* GraphQL */ `
  fragment PostFields on Post {
    id
    title
    uri
    date
    modified
    excerpt
    contentTypeName
    ...SeoFields
    author {
      node {
        name
      }
    }
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
        caption
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
    tags(first: 20) {
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

export const SITE_SEARCH = /* GraphQL */ `
  query SiteSearch(
    $pageFirst: Int!
    $pageAfter: String
    $postFirst: Int!
    $postAfter: String
    $pageWhere: RootQueryToPageConnectionWhereArgs
    $postWhere: RootQueryToPostConnectionWhereArgs
  ) {
    pages(first: $pageFirst, after: $pageAfter, where: $pageWhere) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        uri
      }
    }
    posts(first: $postFirst, after: $postAfter, where: $postWhere) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        uri
        excerpt
        date
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

// Run twice in parallel by getRelatedPosts: once for posts sharing a tag,
// once for posts sharing a category. tags carry `count` so shared tags can
// be weighted by rarity without a separate all-tags query.
export const RELATED_POSTS = /* GraphQL */ `
  query RelatedPosts(
    $first: Int!
    $byTag: RootQueryToPostConnectionWhereArgs
    $byCategory: RootQueryToPostConnectionWhereArgs
    $skipTags: Boolean!
    $skipCategories: Boolean!
  ) {
    byTag: posts(first: $first, where: $byTag) @skip(if: $skipTags) {
      ...RelatedPostNodes
    }
    byCategory: posts(first: $first, where: $byCategory)
      @skip(if: $skipCategories) {
      ...RelatedPostNodes
    }
  }

  fragment RelatedPostNodes on RootQueryToPostConnection {
    nodes {
      id
      title
      uri
      date
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
      tags(first: 20) {
        nodes {
          slug
          count
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
