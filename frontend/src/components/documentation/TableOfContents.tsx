import React, { useState, useEffect } from 'react';
import type { TableOfContentsProps } from '../../models/Documentation';

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  section,
  activeSubsection
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [headers, setHeaders] = useState<{ level: string; title: string; id: string }[]>([]);

  // Extract headings from the DOM (since content is now in separate components)
  useEffect(() => {
    const extractHeaders = () => {
      const headingElements = document.querySelectorAll('.content-article h2, .content-article h3');
      const extractedHeaders: { level: string; title: string; id: string }[] = [];
      
      headingElements.forEach((heading) => {
        const tag = heading.tagName.toLowerCase();
        const title = heading.textContent || '';
        const id = heading.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        if (id && title) {
          extractedHeaders.push({ level: tag, title, id });
        }
      });
      
      setHeaders(extractedHeaders);
    };

    // Extract headers after content loads (wait for lazy-loaded components)
    const timer = setTimeout(extractHeaders, 200);
    
    // Also extract on subsection change
    extractHeaders();

    return () => clearTimeout(timer);
  }, [activeSubsection]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.content-article h2, .content-article h3');

      let maxTop = -Infinity;
      let bestId = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top < 150) {
          if (rect.top > maxTop) {
            maxTop = rect.top;
            bestId = heading.id;
          }
        }
      });

      if (bestId) {
        setActiveId(bestId);
      } else if (headings.length > 0 && window.scrollY < 100) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSubsection, headers]);

  if (!section || headers.length === 0) return null;

  return (
    <aside className="table-of-contents">
      <h3 className="toc-title">On this page</h3>
      <nav className="toc-nav">
        {headers.map((header, idx) => (
          <a
            key={idx}
            href={`#${header.id}`}
            className={`toc-link toc-${header.level} ${activeId === header.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(header.id);
              if (element) {
                const offset = 80; // Header height + padding
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
                setActiveId(header.id); // Immediate feedback
              }
            }}
          >
            {header.title}
          </a>
        ))}
      </nav>
    </aside>
  );
};
