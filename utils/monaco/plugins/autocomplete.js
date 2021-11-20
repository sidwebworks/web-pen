export function registerAutoCompletion(monaco) {
	return monaco.languages.registerCompletionItemProvider("javascript", {
		// These characters should trigger our `provideCompletionItems` function
		triggerCharacters: ["'", '"', ".", "/"],
		// Function which returns a list of autocompletion ietems. If we return an empty array, there won't be any autocompletion.
		provideCompletionItems: (model, position) => {
			// Get all the text content before the cursor
			const textUntilPosition = model.getValueInRange({
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column,
			});
			// Match things like `from "` and `require("`
			if (/(([\s|\n]+from\s+)|(\brequire\b\s*\())["|'][^'^"]*$/.test(textUntilPosition)) {
				// It's probably a `import` statement or `require` call
				if (textUntilPosition.endsWith(".") || textUntilPosition.endsWith("/")) {
					// User is trying to import a file
					return Object.keys(this.props.files)
						.filter((path) => path !== this.props.path)
						.map((path) => {
							let file = getRelativePath(this.props.path, path);
							// Only show files that match the prefix typed by user
							if (file.startsWith(prefix)) {
								// Remove typed text from the path so that don't insert it twice
								file = file.slice(typed.length);
								return {
									// Show the full file path for label
									label: file,
									// Don't keep extension for JS files
									insertText: file.replace(/\.js$/, ""),
									kind: monaco.languages.CompletionItemKind.File,
								};
							}
							return null;
						})
						.filter(Boolean);
				} else {
					// User is trying to import a dependency
					return Object.keys(this.props.dependencies).map((name) => ({
						label: name,
						detail: this.props.dependencies[name],
						kind: monaco.languages.CompletionItemKind.Module,
					}));
				}
			}
		},
	});
}
