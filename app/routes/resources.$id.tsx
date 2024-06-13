import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import React from "react";
import { ImageWithLoader } from "~/components/ImageWithLoader";
import { supabase } from "~/services/supabase";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id) {
    return null;
  }

  const photo = await supabase.from("photos").select("*").eq("id", id).single();

  if (photo.error || !photo.data) {
    return null;
  }

  const imageSrc = await supabase.storage
    .from("photos")
    .createSignedUrl(photo.data.path ?? "", 60);

  if (imageSrc.error || !imageSrc.data) {
    return null;
  }

  return json({
    imageSrc: imageSrc.data.signedUrl,
  });
}

export function SupabaseImage({ id }: { id: string }) {
  const fetcher = useFetcher<typeof loader>();
  const imageSrc = fetcher.data?.imageSrc;

  React.useEffect(() => {
    fetcher.submit(
      {},
      {
        method: "get",
        action: `/resources/${id}`,
      }
    );
  }, []);

  return (
    <div className="flex-1 relative w-full aspect-photo">
      <ImageWithLoader
        src={imageSrc}
        loading={fetcher.state === "loading"}
        error={fetcher.data === null}
      />
    </div>
  );
}
