import { enContentRoute } from "@/lib/contentRoutes";

export const dynamicParams = true;

export const generateStaticParams = enContentRoute.generateStaticParams;
export const generateMetadata = enContentRoute.generateMetadata;
export default enContentRoute.ContentPage;
