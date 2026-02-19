import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const Terminal: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure SQL language features
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          // SQL Keywords
          {
            label: 'SELECT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'SELECT ',
            range: range,
            detail: 'SELECT statement'
          },
          {
            label: 'FROM',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'FROM ',
            range: range,
            detail: 'FROM clause'
          },
          {
            label: 'WHERE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'WHERE ',
            range: range,
            detail: 'WHERE clause'
          },
          {
            label: 'ORDER BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'ORDER BY ',
            range: range,
            detail: 'ORDER BY clause'
          },
          {
            label: 'GROUP BY',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'GROUP BY ',
            range: range,
            detail: 'GROUP BY clause'
          },
          {
            label: 'HAVING',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'HAVING ',
            range: range,
            detail: 'HAVING clause'
          },
          {
            label: 'INSERT INTO',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'INSERT INTO ',
            range: range,
            detail: 'INSERT statement'
          },
          {
            label: 'UPDATE',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'UPDATE ',
            range: range,
            detail: 'UPDATE statement'
          },
          {
            label: 'DELETE FROM',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'DELETE FROM ',
            range: range,
            detail: 'DELETE statement'
          },
          {
            label: 'JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'JOIN ',
            range: range,
            detail: 'JOIN clause'
          },
          {
            label: 'LEFT JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'LEFT JOIN ',
            range: range,
            detail: 'LEFT JOIN clause'
          },
          {
            label: 'RIGHT JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'RIGHT JOIN ',
            range: range,
            detail: 'RIGHT JOIN clause'
          },
          {
            label: 'INNER JOIN',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'INNER JOIN ',
            range: range,
            detail: 'INNER JOIN clause'
          },
          {
            label: 'ON',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'ON ',
            range: range,
            detail: 'ON clause'
          },
          {
            label: 'LIMIT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'LIMIT ',
            range: range,
            detail: 'LIMIT clause'
          },
          {
            label: 'DISTINCT',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'DISTINCT ',
            range: range,
            detail: 'DISTINCT keyword'
          },
          {
            label: 'COUNT',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'COUNT(*)',
            range: range,
            detail: 'COUNT function'
          },
          {
            label: 'SUM',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'SUM(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: 'SUM function'
          },
          {
            label: 'AVG',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'AVG(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: 'AVG function'
          },
          {
            label: 'MAX',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'MAX(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: 'MAX function'
          },
          {
            label: 'MIN',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'MIN(${1:column})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: 'MIN function'
          },
          // Table names from our database
          {
            label: 'Customers',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Customers',
            range: range,
            detail: 'Table: Customer information'
          },
          {
            label: 'Restaurants',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Restaurants',
            range: range,
            detail: 'Table: Restaurant information'
          },
          {
            label: 'MenuItems',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'MenuItems',
            range: range,
            detail: 'Table: Menu items'
          },
          {
            label: 'Orders',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Orders',
            range: range,
            detail: 'Table: Order information'
          },
          {
            label: 'OrderItems',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'OrderItems',
            range: range,
            detail: 'Table: Order item details'
          }
        ];

        return { suggestions };
      }
    });

    // Set editor options
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      tabCompletion: 'on',
      parameterHints: { enabled: true },
      hover: { enabled: true },
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: 24,
      padding: { top: 16, bottom: 16 },
      cursorStyle: 'line',
      cursorBlinking: 'smooth',
      renderLineHighlight: 'all',
      selectionHighlight: true,
      matchBrackets: 'always',
      colorDecorators: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger run command when Ctrl+Enter is pressed
      const runButton = document.querySelector('[data-testid="run-button"]') as HTMLButtonElement;
      if (runButton) {
        runButton.click();
      }
    });
  };

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          placeholder: 'Write your SQL query here...',
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          cursorStyle: 'line',
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
          selectionHighlight: true,
          matchBrackets: 'always',
          colorDecorators: true,
        }}
      />
    </div>
  );
};

export default Terminal;