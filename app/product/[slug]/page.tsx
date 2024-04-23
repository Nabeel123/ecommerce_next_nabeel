import React from "react";
import { client, urlFor } from "../../lib/sanity";
import { fullProduct } from "@/app/interface/product";
import ImageGallery from "@/app/components/ImageGallery";

async function getData(slug: string) {
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
        _id,
          images,
          price,
          name,
          description,
          "slug": slug.current,
          "categoryName": category->name,
          price_id
      }`;
  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Error fetching hero image data:", error);
    // Handle error gracefully, e.g., display a fallback message
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullProduct = await getData(params.slug);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={data.images} />
        </div>
      </div>
    </div>
  );
}
