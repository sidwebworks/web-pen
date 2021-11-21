import { nanoid } from "@reduxjs/toolkit";
import { SyntheticEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { ADD_LOG } from "../../redux/actions/code.actions";
import { ConsoleComponent } from "./Console";
import { Resizeable } from "./Resizeable";

export const Preview: React.FC = () => {
	const iFrameRef = useRef<HTMLIFrameElement | null>(null);
	const dispatch = useDispatch();

	const html = useSelector<RootState, string>(
		(s) => s.code.files.find((s) => s.language === "html")!.value
	);
	const css = useSelector<RootState, string>(
		(s) => s.code.files.find((s) => s.language === "css")!.value
	);
	const javascript = useSelector<RootState, string>((s) => s.code.bundle);

	const loadCode = (e: HTMLIFrameElement) => {
		e.contentWindow!.postMessage({ html: html }, "*");
		e.contentWindow!.postMessage({ css: css }, "*");
		e.contentWindow!.postMessage({ javascript: javascript }, "*");
	};

	useEffect(() => {
		const handler = (event: any) => {
			if (event.data.type === "console") {
				dispatch(
					ADD_LOG({
						method: event.data.method,
						data: JSON.parse(event.data.data),
						id: nanoid(),
					})
				);
			}
		};

		window.addEventListener("message", handler);

		return () => window.removeEventListener("message", handler);
	}, []);

	const onInit = (e: SyntheticEvent<HTMLIFrameElement>) => {
		loadCode(e.currentTarget);
	};

	useEffect(() => {
		if (iFrameRef.current) {
			loadCode(iFrameRef.current);
		}
	}, [javascript, css, html]);

	return (
		<Resizeable direction="horizontal">
			<div className="preview-wrapper">
				<iframe
					onLoad={(e) => onInit(e)}
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
    <style id="_style">
    </style>
    </head>
    <body>
    </body>

    <script>
   

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
        hasCss = typeof css === 'undefined' ? false : true
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
