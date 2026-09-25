import { collectionMetadata, InventoryCollectionPage } from "@/components/site/inventory-collection-page";

export const metadata = collectionMetadata("available");
export const revalidate = 60;

export default function Page() {
  return <InventoryCollectionPage collection="available" />;
}
