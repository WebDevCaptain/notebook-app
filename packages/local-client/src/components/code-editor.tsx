import "./code-editor.css";
import "./syntax.css";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import { useRef } from "react";

// import codeShift from "jscodeshift";
// import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const onEditorDidMount: OnMount = (monacoEditor, _monaco) => {
    // console.log("onEditorDidMount", monacoEditor);
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      onChange(monacoEditor.getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    // const highlighter = new Highlighter(
    //   // @ts-ignore
    //   window.monaco,
    //   codeShift,
    //   monacoEditor
    // );

    // highlighter.highLightOnDidChangeModelContent(
    //   () => {},
    //   () => {},
    //   undefined,
    //   () => {}
    // );
  };

  const onFormatClick = async () => {
    const unformatted = editorRef.current.getValue();

    let formatted;

    try {
      formatted = await prettier.format(unformatted, {
        parser: "babel",
        plugins: [parser, estree],
        useTabs: false,
        semi: true,
        singleQuote: true,
      });
    } catch (err: any) {
      console.log("Error during prettier formatting", err);
      return;
    }

    formatted = formatted.replace(/\n$/, "");

    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
        value={initialValue}
        height="100%"
        language="javascript"
        theme="vs-dark"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 19,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
