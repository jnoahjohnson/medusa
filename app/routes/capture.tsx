import React from "react";
import { CameraIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Camera, CameraType } from "react-camera-pro";
import { MainLayout } from "~/layout/MainLayout";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Form, json, redirect, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { supabase } from "~/services/supabase";
import Webcam from "react-webcam";
import clsx from "clsx";
import sharp from "sharp";
import { verifyImage } from "~/utils/images";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const image = String(formData.get("image"));

  const imageData = Buffer.from(image.split(",")[1], "base64");

  const sharpImage = sharp(imageData);
  const watermark = await fetch(
    `${process.env.PROTOCOL}://${process.env.DOMAIN}/images/watermark.png`
  )
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .catch((error) => console.log(error));

  if (!watermark) {
    return json({ error: "Failed to fetch watermark" }, { status: 500 });
  }

  const output = sharpImage
    .composite([
      {
        input: watermark,
        gravity: "southeast",
      },
    ])
    .sharpen();

  const { data, error } = await supabase.storage
    .from("photos")
    .upload(`image-${Date.now()}.jpeg`, await output.jpeg().toBuffer(), {
      contentType: "image/jpeg",
    });

  console.log({ data, error });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const dbData = await supabase
    .from("photos")
    .insert({
      path: data.path,
      is_approved: false,
    })
    .select("*");

  if (dbData.error) {
    return json({ error: dbData.error.message }, { status: 500 });
  }

  verifyImage(dbData.data[0].id, data.path);

  return redirect(`/photos/${dbData.data[0].id}`);
}

export default function Index() {
  const submitting = useNavigation().state === "submitting";

  const webcamRef = React.useRef<Webcam>(null);
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const [videoDevices, setVideoDevices] = React.useState<MediaDeviceInfo[]>([]);

  React.useEffect(() => {
    (async () => {
      if (videoDevices.length > 0) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter((i) => i.kind == "videoinput"));
    })();
  }, []);

  return (
    <MainLayout hideImage>
      <div className="w-full [&_video]:w-full [&_video]:rounded-lg aspect-photo flex-1 overflow-hidden">
        {!image && (
          <Webcam
            audio={false}
            height="auto"
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={"100%"}
            videoConstraints={{
              deviceId:
                videoDevices.find((v) => v.label.includes("Noah"))?.deviceId ??
                videoDevices.at(0)?.deviceId,
              aspectRatio: 4 / 3,
            }}
          />
        )}

        {image && typeof image === "string" && (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt="Taken photo"
              className={clsx(
                "absolute inset-0 object-cover w-full h-full rounded",
                {
                  "animate-border p-1 bg-white bg-gradient-to-r from-brand-light-blue to-brand-pink bg-[length:400%_400%]":
                    submitting,
                }
              )}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            if (image) {
              setImage(undefined);
              return;
            }

            const imageData = webcamRef.current?.getScreenshot() ?? undefined;

            if (typeof imageData !== "string") {
              return;
            }

            setImage(imageData);
          }}
          className="bg-brand-pink p-4 text-white rounded-full hover:shadow-lg transition-shadow duration-300 ease-in-out mt-4 disabled:opacity-50 disabled:animate-pulse"
          disabled={submitting}
        >
          {image ? (
            <XMarkIcon className="size-10" />
          ) : (
            <CameraIcon className="size-10" />
          )}
        </button>

        {image && (
          <Form method="POST">
            <input type="hidden" name="image" value={image} hidden />
            <button
              type="submit"
              className="bg-brand-pink p-4 text-white rounded-full hover:shadow-lg transition-shadow duration-300 ease-in-out mt-4 disabled:opacity-50 disabled:animate-pulse"
              aria-label="Continue"
              disabled={submitting}
            >
              <ChevronRightIcon className="size-10" />
            </button>
          </Form>
        )}
      </div>
    </MainLayout>
  );
}
