import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { MainLayout } from "~/layout/MainLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Code Adventure Photobooth" },
    {
      name: "description",
      content: "A photobooth for the Code Adventure camp in 2024.",
    },
  ];
};

export default function Index() {
  return (
    <MainLayout>
      <h1 className="font-bold text-6xl font-flair mb-4">Welcome!</h1>
      <div className="flex gap-4">
        <Link to="/capture" className="btn">
          Take Image
        </Link>
        <Link to="/capture" className="btn bg-brand-light-blue">
          View Gallery
        </Link>
      </div>
    </MainLayout>
  );
}
