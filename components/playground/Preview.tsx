import { Dispatch, memo, SetStateAction, useEffect, useRef } from "react";
import { ErrorComponent } from "./Console";

interface PreviewProps {
	code: string;
	error: string;
	setError: Dispatch<SetStateAction<string>>;
}

export const Preview: React.FC<PreviewProps> = ({ code, error, setError }) => {
	const iFrameRef = useRef<HTMLIFrameElement | null>(null);

	useEffect(() => {
		const handler = (event: any) => {
            if (event.data?.title === "script.js") {
                console.log('web worker: ', event);

            }
			if (event.data.type === "error") {
				setError(event.data.error.toString());
			}
		};

		window.addEventListener("message", handler);

		return () => window.removeEventListener("message", handler);
	}, []);

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
			<ErrorComponent error={error} />
		</div>
	);
};

const _html = `
<html lang="en">
    <head> 
    </head>
    <body>
    <div id="root"></div>
    <script>
        const handleError = (err) => {
            console.log('err: ', err);
            const message = {
                error: err,
                type: "error"
            };
            window.parent.postMessage(message, '*');
        }

        window.addEventListener(
            "error",
            (event) => {
                console.log('error event: ', event);
               handleError(event.error)
            },
            false
        );
       
            window.addEventListener(
                "message",
                (event) => {
                    try {
                        eval(event.data)
                    } catch (err) {
                        handleError(err)
                    }
                },
                false
            );
            
    </script>
    </body>
</html>
`;
