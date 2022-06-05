import clsx from "clsx";
import { FC } from "react";
import { AlertOctagon, BatteryCharging } from "react-feather";
import { useTypedSelector } from "src/utils/store/store";

const Footer = () => {
  const { isBundling, isError, isInitialized } = useTypedSelector(
    (s) => s.bundler
  );

  return (
    <footer className="relative bottom-0 flex-grow-0 flex items-center justify-between w-full px-3 py-1 bg-dark-900 ">
      <div className="flex items-center max-w-sm ">
        {isBundling || !isInitialized ? (
          <Loader />
        ) : isError ? (
          <AlertOctagon className="w-4 h-4 mr-2 text-red-500 " />
        ) : (
          <BatteryCharging className="w-4 h-4 mr-2 text-cyan-500 " />
        )}
        <span className="block py-0.5 text-xs  text-true-gray-500">
          Bundler state:{" "}
          <span className={clsx(isError ? "text-red-500" : "text-cyan-500")}>
            {!isError && !isInitialized
              ? "Initializing..."
              : isError
              ? "Bundling Error"
              : isBundling
              ? "Bundling..."
              : "Idle"}
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

const Loader = () => {
  return (
    <svg
      className="w-3 h-3 mr-2 -ml-1 text-white animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
