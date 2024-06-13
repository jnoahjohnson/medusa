import React from "react";

export const MainLayout: React.FC<{
  children: React.ReactNode;
  hideImage?: boolean;
}> = ({ children, hideImage }) => {
  return (
    <main className="w-full h-full bg-brand-dark-blue text-white border-b-8 border-brand-pink text-center flex flex-col items-center justify-center relative px-2">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center overflow-auto">
        {children}
      </div>
      {!hideImage && (
        <img
          src="/images/light-logo.png"
          className="w-64 h-auto mt-auto absolute bottom-8"
          alt="Code Adventure"
        />
      )}
    </main>
  );
};
