import { hrContentRoute } from "@/lib/contentRoutes";

export const dynamicParams = true;

export const generateStaticParams = hrContentRoute.generateStaticParams;
export const generateMetadata = hrContentRoute.generateMetadata;
export default hrContentRoute.ContentPage;
