import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useTypedSelector } from "src/utils/store/store";
import { createSnippet } from "./preview.helpers";


const Preview: React.FC = () => {
  const { css, html, js } = useTypedSelector((p) => p.preview.source);
  const iframe = useRef<HTMLIFrameElement>(null);

  const result = useMemo(() => {
    return createSnippet({ html, css, js });
  }, [html, css, js]);

  useEffect(() => {
    if (!iframe.current?.contentWindow) return;
    iframe.current.srcdoc = result;
  }, [result]);

  const onLoad: ReactEventHandler<HTMLIFrameElement> = useCallback((ev) => {},
  []);

  return (
    <div className={"preview-wrapper h-full"}>
      <iframe
        ref={iframe}
        onLoad={onLoad}
        title="preview"
        srcDoc={result}
        className="h-full"
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
};

export default Preview;
