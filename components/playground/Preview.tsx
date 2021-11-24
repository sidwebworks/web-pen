import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { CREATE_BUNDLE } from "../../redux/actions/bundler.actions";
import { PRINT_CONSOLE } from "../../redux/actions/editor.actions";
import { ConsoleComponent } from "./Console";
import { Resizeable } from "./Resizeable";

export const Preview: React.FC = () => {
	const iFrameRef = useRef<HTMLIFrameElement | null>(null);
	const dispatch = useDispatch();
	const javascript = useSelector<RootState, string>((s) => s.bundler.bundle);
	const isInit = useSelector<RootState, boolean>((s) => s.bundler.initialized);
	const html = useSelector<RootState, string>((s) => s.editor.files.markup.value);
	const css = useSelector<RootState, string>((s) => s.editor.files.styles.value);

	const loadCode = useCallback(
		(e: HTMLIFrameElement) => {
			e.contentWindow!.postMessage({ html: html }, "*");
			e.contentWindow!.postMessage({ css: css }, "*");
			e.contentWindow!.postMessage({ javascript: javascript }, "*");
		},
		[html, css, javascript]
	);

	useEffect(() => {
		if (iFrameRef.current) {
			loadCode(iFrameRef.current);
		}
	}, [javascript, css, html]);

	useEffect(() => {
		if (!javascript) {
			dispatch(CREATE_BUNDLE());
		}

		const handler = (event: any) => {
			if (event.data.type === "console") {
				console[event.data.method](JSON.parse(event.data.data).join(" "));
				dispatch(
					PRINT_CONSOLE({
						method: event.data.method,
						data: JSON.parse(event.data.data),
					})
				);
			}
		};

		window.addEventListener("message", handler);

		return () => window.removeEventListener("message", handler);
	}, []);

	return (
		<Resizeable direction="horizontal">
			<div className={"preview-wrapper"}>
				<Transition
					appear={true}
					show={true && !isInit}
					key={"asdasd"}
					enter="transition duration-100  ease-out"
					enterFrom="transform  opacity-100"
					enterTo="transform opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform opacity-100"
					leaveTo="transform opacity-0"
					className="absolute z-10 grid w-full h-full bg-gray-900 place-items-center"
				>
					<Loader type="ThreeDots" color="cyan" />
				</Transition>
				<iframe
					onLoad={(e) => loadCode(e.currentTarget)}
					title="preview"
					srcDoc={_html}
					ref={iFrameRef}
					sandbox="allow-scripts"
				/>
			</div>
			<ConsoleComponent />
		</Resizeable>
	);
};

const _html = `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style id="_style"></style>
</head>

<body>
    <div id="root"></div>
</body>

<script type="module">

const _log = console.log

const types = ['log', 'debug', 'info', 'warn', 'error', 'table', 'clear', 'time', 'timeEnd', 'count' , 'assert']

function proxy(context, method, message) { 
    return function() {
        window.parent.postMessage({type: "console", method: method.name, data: JSON.stringify(Array.prototype.slice.apply(arguments))}, '*');
    }
  }

  types.forEach(el =>  {
    window.console[el] = proxy(console, console[el], el)
  })

function setHtml(html) {
    document.body.innerHTML = html
}

  function executeJs(javascript) {
    try {
        eval(javascript)
    } catch (err) {
        console.error(err.message)
    }
}

  function setCss(css) {
    const style = document.getElementById('_style')
    const newStyle = document.createElement('style')
    newStyle.id = '_style'
    newStyle.innerHTML = typeof css === 'undefined' ? '' : css
    style.parentNode.replaceChild(newStyle, style)
  }

  window.addEventListener(
    "error",
    (event) => {
       console.error(event.error)
    },
    false
);

    window.addEventListener(
        "message",
        (e) => {
            if (typeof e.data.html !== 'undefined'){
                setHtml(e.data.html)
            }

           if (typeof e.data.javascript !== 'undefined'){
             executeJs(e.data.javascript)
           } 

           if (typeof e.data.css !== 'undefined'){
            setCss(e.data.css)
           } 
        },
        false
    );
    </script> 

</html>
`;
