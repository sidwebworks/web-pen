import { memo, useEffect, useRef } from "react";

interface PreviewProps {
	code: string;
}

export const Preview: React.FC<PreviewProps> = ({ code }) => {
	const iFrameRef = useRef<HTMLIFrameElement | null>(null);

	useEffect(() => {
		iFrameRef.current!.srcdoc = _html;
		const timeout = setTimeout(() => {
			iFrameRef.current!.contentWindow!.postMessage(code, "*");
		}, 50);

		return () => clearTimeout(timeout);
	}, [code]);

	return (
		<div className="preview-wrapper">
			<iframe title="preview" srcDoc={_html} ref={iFrameRef} sandbox="allow-scripts" />{" "}
		</div>
	);
};

const _html = `
<html lang="en">
    <head> 
    <style>
    background: white;
    </style>
    </head>
    <body>
    <div id="root"></div>
    <script>
        window.addEventListener(
            "message",
            (event) => {
                try {
                    eval(event.data)
                } catch (err) {
                    const root = document.querySelector("#root")
                    root.innerHTML = '<div style="color:red;"><h4>' + err + '</h4></div>'
                    console.error(err)
                }
            },
            false
        );
        
    </script>
    </body>
</html>
`;
