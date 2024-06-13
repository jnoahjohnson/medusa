import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ImageWithLoader } from "~/components/ImageWithLoader";
import { MainLayout } from "~/layout/MainLayout";
import { generateQR } from "~/services/qr";
import { supabase } from "~/services/supabase";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id) {
    return redirect("/");
  }

  const photo = await supabase.from("photos").select("*").eq("id", id).single();

  if (photo.error || !photo.data) {
    return redirect("/");
  }

  const imageSrc = await supabase.storage
    .from("photos")
    .createSignedUrl(photo.data.path ?? "", 60);

  if (imageSrc.error || !imageSrc.data) {
    return redirect("/");
  }

  const qrCode = await generateQR(imageSrc.data.signedUrl);

  if (!qrCode) {
    return redirect("/");
  }

  return json({
    imageSrc: imageSrc.data.signedUrl,
    qrCode,
  });
}

export default function Photo() {
  const { imageSrc, qrCode } = useLoaderData<typeof loader>();
  return (
    <MainLayout>
      <section className="flex flex-col w-full gap-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <h2 className="font-bold text-3xl font-flair">Enjoy the camp!</h2>
          <p className="font-semibold text-xl">
            Scan the QR code to download your photo
          </p>
          <img src={qrCode} className="w-64 h-auto" />
        </div>
        <div className="relative w-full max-w-[440px] mx-auto aspect-photo">
          <ImageWithLoader src={imageSrc} />
        </div>
      </section>
      <Link to="/capture" className="btn mt-6">
        Start Over
      </Link>
    </MainLayout>
  );
}
