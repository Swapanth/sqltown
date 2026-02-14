import React from 'react';
import { CodeBlock } from './CodeBlock';
import type { ContentAreaProps, ContentBlock } from '../../models/Documentation';

export const ContentArea: React.FC<ContentAreaProps> = ({
  section,
  subsectionId,
  database
}) => {
  if (!section) {
    return (
      <main className="content-area">
        <div className="empty-state">
          <h2>Welcome to {database.toUpperCase()} Documentation</h2>
          <p>Select a topic from the sidebar to get started</p>
        </div>
      </main>
    );
  }

  const currentSubsection = subsectionId
    ? section.subsections?.find(s => s.id === subsectionId)
    : section.subsections?.[0];

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        const contentWithIds = block.content.replace(/<(h[23])>(.*?)<\/\1>/g, (_, tag, title) => {
          const cleanTitle = title.replace(/<[^>]*>/g, '');
          const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return `<${tag} id="${id}">${title}</${tag}>`;
        });
        return (
          <div key={index} className="content-text" dangerouslySetInnerHTML={{ __html: contentWithIds }} />
        );

      case 'code':
        return (
          <CodeBlock
            key={index}
            code={block.content}
            language={block.language || 'sql'}
          />
        );

      case 'example':
        return (
          <div key={index} className="content-example">
            <div className="example-header">
              <span className="example-label">Example</span>
            </div>
            <CodeBlock
              code={block.content}
              language={block.language || 'sql'}
            />
            {block.caption && <p className="example-caption">{block.caption}</p>}
          </div>
        );

      case 'note':
        return (
          <div key={index} className="content-note">
            <div className="note-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="note-content" dangerouslySetInnerHTML={{ __html: block.content }} />
          </div>
        );

      case 'image':
        return (
          <div key={index} className="content-image">
            <img src={block.content} alt={block.caption || ''} />
            {block.caption && <p className="image-caption">{block.caption}</p>}
          </div>
        );

      case 'table':
        return (
          <div key={index} className="content-table-container">
            <table className="content-table">
              {block.headers && (
                <thead>
                  <tr>
                    {block.headers.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
              )}
              {block.rows && (
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {block.caption && <p className="table-caption">{block.caption}</p>}
          </div>
        );

      case 'output':
        return (
          <div key={index} className="content-output">
            <div className="output-header">
              <span className="output-label">Output</span>
            </div>
            <pre className="output-content">{block.content}</pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="content-area">
      <div className="breadcrumb">
        <a href="#overview">Overview</a>
        <span className="breadcrumb-separator">›</span>
        <a href={`#${section.id}`}>{section.title}</a>
        {currentSubsection && (
          <>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{currentSubsection.title}</span>
          </>
        )}
      </div>

      <article className="content-article">
        <h1 className="content-title">{currentSubsection?.title || section.title}</h1>

        {currentSubsection?.description && (
          <p className="content-description">{currentSubsection.description}</p>
        )}

        {currentSubsection?.content?.map((block, index) => renderContentBlock(block, index))}
      </article>
    </main>
  );
};
