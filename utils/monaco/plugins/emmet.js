import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";

let _html, _css, _jsx;

export function registerEmmet(monaco) {
	if (!_html || !_css || !_jsx) {
		_html = emmetHTML(monaco);
		// _css = emmetCSS(monaco);
		_jsx = emmetJSX(monaco);
	}

	return { dispose: { html: _html, css: _css, jsx: _jsx } };
}
