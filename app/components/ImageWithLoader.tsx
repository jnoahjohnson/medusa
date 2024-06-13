import React from "react";

export const ImageWithLoader: React.FC<{
  src?: string;
  loading?: boolean;
  error?: boolean;
}> = ({ src, loading, error }) => {
  const [didLoad, setDidLoad] = React.useState(false);

  return (
    <div className="relative w-full h-full">
      {src && (
        <img
          src={src}
          alt="Taken photo"
          className="absolute inset-0 object-cover w-full h-full rounded"
          onLoad={() => setDidLoad(true)}
        />
      )}
      {error && (
        <div className="absolute inset-0 bg-brand-red w-full h-full rounded flex items-center justify-center">
          <p className="text-white">Error loading image</p>
        </div>
      )}
      {!didLoad || loading ? (
        <div className="absolute inset-0 bg-brand-light-blue animate-pulse w-full h-full rounded" />
      ) : error ? (
        <div className="absolute inset-0 bg-slate-700 w-full h-full rounded" />
      ) : null}
    </div>
  );
};
