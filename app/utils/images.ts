import { checkExplicitImage } from "~/services/eden";
import { supabase } from "~/services/supabase";

export const verifyImage = async (id: number, path: string) => {
  const imageSrc = await supabase.storage
    .from("photos")
    .createSignedUrl(path, 60);

  if (imageSrc.error || !imageSrc.data) {
    return;
  }

  const explicitResponse = await checkExplicitImage(imageSrc.data.signedUrl);

  if (!explicitResponse) {
    return;
  }

  if (explicitResponse.amazon.nsfw_likelihood_score > 0.5) {
    console.log("Explicit content detected, deleting image");
  }

  await supabase.from("photos").update({ is_approved: true }).eq("id", id);
};
