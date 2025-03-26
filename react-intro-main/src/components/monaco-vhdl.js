import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Регистрация языка VHDL
const registerVHDL = (monaco) => {
  monaco.languages.register({ id: 'vhdl' });

  monaco.languages.setMonarchTokensProvider('vhdl', {
    keywords: [
      'library', 'use', 'entity', 'architecture', 'is', 'port', 'in', 'out', 'inout',
      'begin', 'end', 'signal', 'process', 'if', 'then', 'else', 'elsif',
      'case', 'when', 'loop', 'while', 'for', 'generate', 'component',
      'generic', 'map', 'report', 'severity', 'not', 'and', 'or', 'nor', 'nand',
      'xor', 'xnor', 'others'
    ],
    operators: [
      '<=', '=>', '=', '/=', '<', '<=', '>', '>=', '+', '-', '*', '/', '&', '|',
      'and', 'or', 'not', 'nor', 'nand', 'xor', 'xnor'
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [/\b(?:library|use|entity|architecture|is|port|in|out|inout|begin|end|signal|process|if|then|else|elsif|case|when|loop|while|for|generate|component|generic|map|report|severity|not|and|or|nor|nand|xor|xnor|others)\b/, 'keyword'],
        [/\b(?:not|and|or|nor|nand|xor|xnor)\b/, 'logical-operator'],
        [/\b\d+(\.\d+)?([eE][\-+]?\d+)?\b/, 'number'],
        [/--.*/, 'comment'],
        [/[=><!~?:&|+\-*\/\^%]+/, 'operator'],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, 'identifier'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"([^"\\]|\\.)*"/, 'string'],
        [/\(/, 'parenthesis'],
        [/\)/, 'parenthesis'],
        [/\bprocess\b/, 'keyword'],
        [/\bbegin\b/, 'keyword'],
        [/\bend\b/, 'keyword'],
        [/\bcomponent\b/, 'keyword'],
        [/\bport map\b/, 'keyword'],
        [/\bgeneric map\b/, 'keyword'],
      ],
    },
  });

  monaco.editor.defineTheme('my-custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: 'b0b0b0', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'string', foreground: '50fa7b' },
      { token: 'operator', foreground: 'ff5555' },
      { token: 'type', foreground: 'ffb86c' },
      { token: 'function', foreground: 'f1fa8c' },
      { token: 'variable', foreground: '8be9fd' },
      { token: 'parenthesis', foreground: 'ffb86c' },
      { token: 'constant', foreground: 'ff5555' },
      { token: 'keyword.operator', foreground: 'ff79c6' },
      { token: 'string.quote', foreground: '8be9fd' },
      { token: 'number.hex', foreground: 'bd93f9' },
      { token: 'predefined', foreground: 'f1fa8c' },
      { token: 'type.identifier', foreground: 'f8f8f2' },
    ],
    colors: {
      'editor.foreground': '#f8f8f2',
      'editor.background': '#101015',
      'editorCursor.foreground': '#f8f8f0',
      'editor.lineHighlightBackground': '#44475a',
      'editorLineNumber.foreground': '#6272a4',
      'editor.selectionBackground': '#44475a',
      'editor.inactiveSelectionBackground': '#44475a',
      'editor.selectionHighlightBackground': '#ff79c6',
      'editor.wordHighlightBackground': '#8be9fd',
      'editor.wordHighlightStrongBackground': '#50fa7b',
      'editorBracketMatch.background': '#ffb86c',
      'editorBracketMatch.border': '#ff79c6',
    },
  });
};

// Основной компонент редактора VHDL
const VHDLEditor = ({ initialCode, onCodeChange }) => {
  const handleEditorWillMount = (monaco) => {
    registerVHDL(monaco); // Регистрируем язык VHDL
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="vhdl"
      defaultValue={initialCode}
      theme="my-custom-dark"
      beforeMount={handleEditorWillMount}
      onChange={(value) => onCodeChange(value || '')}
      options={{
        automaticLayout: true,
      }}
    />
  );
};

export default registerVHDL;
