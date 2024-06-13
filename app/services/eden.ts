export const checkExplicitImage = async (image: string) => {
  const data = await fetch("https://api.edenai.run/v2/image/explicit_content", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EDEN_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      providers: "amazon",
      file_url: image,
    }),
  })
    .then((res) => res.json())
    .then((data) => data as unknown as ExplicitImageResponse)
    .catch((error) => console.error(error));

  console.log({ data });
  return data;
};

type ExplicitImageResponse = {
  amazon: {
    status: string;
    nsfw_likelihood: number;
    nsfw_likelihood_score: number;
    items: {
      label: string;
      likelihood: number;
      likelihood_score: number;
      category: string;
      subcategory: string;
    }[];
    cost: number;
  };
};
