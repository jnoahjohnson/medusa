import React from "react";

export const ImageWithLoader: React.FC<{ src: string }> = ({ src }) => {
  const [didLoad, setDidLoad] = React.useState(false);

  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt="Taken photo"
        className="absolute inset-0 object-cover w-full h-full rounded"
        onLoad={() => setDidLoad(true)}
      />
      {!didLoad && (
        <div className="absolute inset-0 bg-brand-light-blue animate-pulse w-full h-full rounded" />
      )}
    </div>
  );
};
