import { useEffect } from "react";

export default function Alert({
  isOpened,
  setIsOpened,
  text,
  duration = 3000,
}) {
  useEffect(() => {
    if (isOpened) {
      setTimeout(() => {
        setIsOpened(false);
      }, duration);
    }
  }, [isOpened]);

  return (
    <div
      className={`fixed top-5 right-5 bg-[#222] text-white p-4 rounded w-[calc(100vw-40px)] max-w-[300px] z-[9999] scale-100 transition-all duration-300 ${
        isOpened
          ? "opacity-100 visible scale-100"
          : "opacity-0 invisible scale-50"
      }`}
    >
      {text}
    </div>
  );
}
