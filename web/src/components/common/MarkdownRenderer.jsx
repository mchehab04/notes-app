import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configure marked with GFM options
marked.setOptions({
  gfm: true,
  breaks: true
});

export default function MarkdownRenderer({ content = '', className = '', compact = false }) {
  const html = useMemo(() => {
    if (!content) return '';
    try {
      return marked.parse(content);
    } catch (err) {
      console.error('Markdown parse error:', err);
      return content;
    }
  }, [content]);

  return (
    <div 
      className={`markdown-body ${compact ? 'markdown-compact' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
