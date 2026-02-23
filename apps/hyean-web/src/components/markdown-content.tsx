import type { ReactNode } from 'react';

type MarkdownContentProps = {
  content: string;
};

type ListState = {
  type: 'ul' | 'ol';
  items: string[];
};

const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const chunks: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    const start = match.index;
    const end = start + fullMatch.length;

    if (start > cursor) {
      chunks.push(text.slice(cursor, start));
    }

    chunks.push(
      <a href={href} target="_blank" rel="noreferrer" key={`${href}-${start}`}>
        {label}
      </a>,
    );
    cursor = end;
  }

  if (cursor < text.length) {
    chunks.push(text.slice(cursor));
  }

  if (chunks.length === 0) {
    chunks.push(text);
  }
  return chunks;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let quoteBuffer: string[] = [];
  let listState: ListState | null = null;
  let codeFence: string[] | null = null;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join(' ').trim();
    if (text) {
      blocks.push(
        <p className="markdown-paragraph" key={`p-${blocks.length}`}>
          {renderInline(text)}
        </p>,
      );
    }
    paragraphBuffer = [];
  };

  const flushQuote = () => {
    if (quoteBuffer.length === 0) return;
    const text = quoteBuffer.join(' ').trim();
    if (text) {
      blocks.push(
        <blockquote className="markdown-quote" key={`q-${blocks.length}`}>
          {renderInline(text)}
        </blockquote>,
      );
    }
    quoteBuffer = [];
  };

  const flushList = () => {
    if (!listState || listState.items.length === 0) return;
    const items = listState.items.map((item, index) => (
      <li key={`li-${blocks.length}-${index}`}>{renderInline(item)}</li>
    ));
    if (listState.type === 'ul') {
      blocks.push(
        <ul className="markdown-list" key={`ul-${blocks.length}`}>
          {items}
        </ul>,
      );
    } else {
      blocks.push(
        <ol className="markdown-list markdown-ordered-list" key={`ol-${blocks.length}`}>
          {items}
        </ol>,
      );
    }
    listState = null;
  };

  const flushAllTextBuffers = () => {
    flushParagraph();
    flushQuote();
    flushList();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushAllTextBuffers();
      if (codeFence) {
        const codeText = codeFence.join('\n');
        blocks.push(
          <pre className="markdown-code" key={`code-${blocks.length}`}>
            <code>{codeText}</code>
          </pre>,
        );
        codeFence = null;
      } else {
        codeFence = [];
      }
      continue;
    }

    if (codeFence) {
      codeFence.push(line);
      continue;
    }

    if (!trimmed) {
      flushAllTextBuffers();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushAllTextBuffers();
      blocks.push(
        <h4 className="markdown-subheading-small" key={`h4-${blocks.length}`}>
          {trimmed.replace(/^###\s+/, '')}
        </h4>,
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushAllTextBuffers();
      blocks.push(
        <h3 className="markdown-subheading" key={`h3-${blocks.length}`}>
          {trimmed.replace(/^##\s+/, '')}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushAllTextBuffers();
      blocks.push(
        <h2 className="markdown-heading" key={`h2-${blocks.length}`}>
          {trimmed.replace(/^#\s+/, '')}
        </h2>,
      );
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      const item = unorderedMatch[1].trim();
      if (!listState || listState.type !== 'ul') {
        flushList();
        listState = { type: 'ul', items: [] };
      }
      listState.items.push(item);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      const item = orderedMatch[1].trim();
      if (!listState || listState.type !== 'ol') {
        flushList();
        listState = { type: 'ol', items: [] };
      }
      listState.items.push(item);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph();
      flushList();
      quoteBuffer.push(trimmed.replace(/^>\s+/, ''));
      continue;
    }

    paragraphBuffer.push(trimmed);
  }

  flushAllTextBuffers();

  if (codeFence && codeFence.length > 0) {
    blocks.push(
      <pre className="markdown-code" key={`code-tail-${blocks.length}`}>
        <code>{codeFence.join('\n')}</code>
      </pre>,
    );
  }

  return <div className="markdown-content">{blocks}</div>;
}
