import React, { useState, useEffect } from 'react';
import type { TableOfContentsProps } from '../../models/Documentation';

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  section,
  activeSubsection
}) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Scope to content area to avoid picking up potential sidebar/header elements
      const headings = document.querySelectorAll('.content-article h2, .content-article h3');

      let maxTop = -Infinity;
      let bestId = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        // Header height is approx 64px. Let's say offset is 150px to trigger "active" slightly before it hits top.
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
        // If we are at the very top, highlight the first one
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Add a small delay to ensure DOM is updated after route change
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSubsection]);

  if (!section) return null;

  const currentSubsection = section.subsections?.find(s => s.id === activeSubsection);
  if (!currentSubsection) return null;

  const headers: { level: string; title: string; id: string }[] = [];
  currentSubsection.content?.forEach(block => {
    if (block.type === 'text') {
      const regex = /<(h[23])>(.*?)<\/\1>/g;
      let match;
      while ((match = regex.exec(block.content)) !== null) {
        const tag = match[1];
        const title = match[2].replace(/<[^>]*>/g, '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        headers.push({ level: tag, title, id });
      }
    }
  });

  if (headers.length === 0) return null;

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
