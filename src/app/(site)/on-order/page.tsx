import { collectionMetadata, InventoryCollectionPage } from "@/components/site/inventory-collection-page";

export const metadata = collectionMetadata("on_order");
export const revalidate = 60;

export default function Page() {
  return <InventoryCollectionPage collection="on_order" />;
}
