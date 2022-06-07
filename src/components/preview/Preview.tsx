import { useIsomorphicEffect } from "@hooks/common";

import { unix } from "path-fx";
import { ReactEventHandler, useCallback, useMemo, useRef } from "react";

import { useTypedSelector } from "src/lib/store/store";
import { createSnippet } from "./preview.helpers";

const Preview: React.FC = () => {
  const { css, html, js } = useTypedSelector((p) => p.preview.source);

  const error = useTypedSelector((s) => s.bundler.error);

  const iframe = useRef<HTMLIFrameElement>(null);

  const result = useMemo(
    () => createSnippet({ html, css, js }),
    [html, js, css]
  );

  useIsomorphicEffect(() => {
    if (!iframe.current) return;
    iframe.current.srcdoc = result;
  }, [result]);

  return (
    <div className={"preview-wrapper relative h-full"}>
      <ErrorLens file={error.file} frame={error.frame} />
      <iframe
        ref={iframe}
        title="preview"
        srcDoc={result}
        className="h-full"
        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
      />
    </div>
  );
};

export default Preview;

const ErrorLens: React.FC<{ frame: string; file: string }> = ({
  frame = "",
  file,
}) => {
  if (!frame.trim().length) return null;

  return (
    <div className="w-full h-full absolute z-10 p-2 inset-0 bg-black">
      <p className="text-red-400 text-xl font-medium">
        Error in <span>{file.replace("/", "")}</span>
      </p>
      <pre className=" mt-2 text-red-400 w-full whitespace-pre-wrap text-sm">
        {frame}
      </pre>
    </div>
  );
};
