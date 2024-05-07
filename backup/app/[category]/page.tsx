import { simplifiedProduct } from "../interface/product";
import { client } from "../lib/sanity";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

async function getData(category: string) {
  const query = `*[_type == "product" && category->name == "${category}"] {
        _id,
          "imageUrl": images[0].asset->url,
          price,
          name,
          "slug": slug.current,
          "categoryName": category->name
      }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Error fetching hero image data:", error);
    // Handle error gracefully, e.g., display a fallback message
    return [];
  }
}
export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const data: simplifiedProduct[] = await getData(params.category);
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500 text-2xl md:text-2xl mt-5">
        No available products in this category.
      </p>
    );
  }
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Newest Products
          </h2>
          <Link className="text-primary items-center flex gap-x-1" href="/all">
            See All{" "}
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 gray-hover:opacity-75 lg:h-80">
                <Image
                  src={product.imageUrl}
                  alt="Product image"
                  className="w-full h-full object-cover object-center lg:h-full lg:w-full"
                  width={300}
                  height={300}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-sm font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {product.categoryName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
