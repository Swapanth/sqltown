import React, { useState } from 'react';
import type { CodeBlockProps } from '../../models/Documentation';

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">{language}</span>
        {fileName && <span className="code-filename">{fileName}</span>}
        <button
          className="code-copy-btn"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 4L6 11l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
          <span className="copy-text">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-pre">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
