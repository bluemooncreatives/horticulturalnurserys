import AboutUsClient from "./AboutUsClient";
import { getBestsellerProducts } from "@/lib/services/productService";
import { pickRandom } from "@/lib/utils";

export const metadata = {
  title: "About Us",
  description:
    "Horticultural Development Centre has grown plants and built gardens from Kolkata since 1989 - a 50-bigha nursery at Bibirhut, qualified horticulturists, and landscaping credentials with State Government departments and CPWD.",
};

// Re-render per request so the random picks vary on each visit (the bestseller
// pool itself stays cached inside getBestsellerProducts).
export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
  // "You May Also Like" - 4 random picks from the storefront bestseller pool.
  const products = await getBestsellerProducts();
  return <AboutUsClient products={pickRandom(products ?? [], 4)} />;
}
