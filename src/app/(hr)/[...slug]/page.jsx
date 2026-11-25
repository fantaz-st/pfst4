import { hrContentRoute } from "@/features/pages/contentRoute";

export const dynamicParams = true;

export const generateStaticParams = hrContentRoute.generateStaticParams;
export const generateMetadata = hrContentRoute.generateMetadata;
export default hrContentRoute.ContentPage;
