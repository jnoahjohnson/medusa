import { Link, json, useLoaderData } from "@remix-run/react";
import { ImageWithLoader } from "~/components/ImageWithLoader";
import { MainLayout } from "~/layout/MainLayout";
import { supabase } from "~/services/supabase";
import { SupabaseImage } from "./resources.$id";

export async function loader() {
  const verifiedImages = await supabase
    .from("photos")
    .select("*")
    .eq("is_approved", true);

  return json({
    images: verifiedImages.data?.reverse() ?? [],
  });
}

export default function Gallery() {
  const { images } = useLoaderData<typeof loader>();

  return (
    <MainLayout hideImage>
      <div className="overflow-hidden py-6 w-full h-full">
        <div className="mb-6">
          <h1 className="text-5xl font-flair font-bold ">Gallery</h1>
          <Link to="/" className="text-brand-pink font-semibold">
            Go Home
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full overflow-auto pb-20">
          {images.map((image) => (
            <SupabaseImage key={image.id} id={image.id.toString()} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
