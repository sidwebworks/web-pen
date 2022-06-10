import { useEffect, useMemo, useRef } from "react";
import { UPDATE_ERROR } from "src/lib/store/slices/preview";

import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { createSnippet } from "./preview.helpers";

const Preview: React.FC = () => {
  const { css, html, js } = useTypedSelector((s) => s.preview.source);

  const dispatch = useTypedDispatch();

  const runTimeError = useTypedSelector((s) => s.preview.error);

  const { isInitialized, error } = useTypedSelector((s) => s.bundler);

  const iframe = useRef<HTMLIFrameElement>(null);

  const result = useMemo(() => createSnippet({ html, css }), [html, css]);

  const postCode = (target: HTMLIFrameElement) => {
    target.contentWindow.postMessage({ code: js }, "*");
  };

  useEffect(() => {
    if (!iframe.current) return;
    iframe.current.srcdoc = result;
  }, [result]);

  useEffect(() => {
    postCode(iframe.current);
  }, [js, result]);

  useEffect(() => {
    const handler = (ev: MessageEvent<{ error: Error }>) => {
      if (typeof ev.data?.error !== "string") return;
      dispatch(UPDATE_ERROR(ev.data.error));
    };

    window.addEventListener("message", (ev) => handler(ev));

    return () => window.removeEventListener("message", (ev) => handler(ev));
  }, []);

  return (
    <div className={"preview-wrapper relative h-full"}>
      {!isInitialized && <LoadingView />}

      <ErrorLens file={error.file} frame={error.frame} runtime={runTimeError} />

      <iframe
        ref={iframe}
        onLoad={(e) => postCode(e.target as HTMLIFrameElement)}
        title="preview"
        srcDoc={result}
        className="h-full"
        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
      />
    </div>
  );
};

export default Preview;

const ErrorLens: React.FC<{ frame: string; file: string; runtime: string }> = ({
  frame = "",
  runtime,
  file,
}) => {
  if (!frame.trim().length && !runtime.trim().length) return null;

  return (
    <div className="w-full h-full absolute z-10 p-2 inset-0 bg-black">
      <p className="text-red-400 text-xl font-medium">
        {file.trim() ? `Error in ${file.replace("/", "")}` : ""}
      </p>
      <pre className="mt-2 text-red-400 w-full whitespace-pre-wrap text-base">
        {frame || runtime}
      </pre>
    </div>
  );
};

const LoadingView: React.FC = () => {
  return (
    <div className="w-full h-full grid place-content-center absolute z-20 p-2 inset-0 bg-[#011322]">
      <div className="preview-loader loader">
        <div></div>
        <div></div>
      </div>
      <span className="font-medium  mt-4 text-lg text-cyan-400 text-center ">
        Initializing...
      </span>
    </div>
  );
};
