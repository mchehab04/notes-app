import fs from 'node:fs';

export function parseNotesFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const items = [];

  let currentSection = 'General';
  let bufferDeepDive = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Checkbox To-Do (open or done)
    const todoMatch = line.match(/^[-*]\s*\[([ xX])\]\s*(.+)$/);
    if (todoMatch) {
      const isDone = todoMatch[1].toLowerCase() === 'x';
      const title = todoMatch[2].trim();
      items.push({
        type: 'todo',
        title,
        content: '',
        section: currentSection,
        metadata: {
          status: isDone ? 'done' : 'open',
          tags: ['imported']
        }
      });
      continue;
    }

    // Question
    if (line.match(/^(?:Q:|\?|Question:)\s*(.+)$/i) || (line.endsWith('?') && line.length < 120)) {
      const qText = line.replace(/^(?:Q:|\?|Question:)\s*/i, '').trim();
      items.push({
        type: 'question',
        title: qText,
        content: '',
        section: currentSection,
        metadata: {
          status: 'open',
          tags: ['imported', 'question']
        }
      });
      continue;
    }

    // Technology / Library mention
    if (line.match(/^(?:Tech|Technologies|Libraries|Stack):\s*(.+)$/i)) {
      const techList = line.replace(/^(?:Tech|Technologies|Libraries|Stack):\s*/i, '').split(/[,;]/);
      for (const t of techList) {
        if (t.trim()) {
          items.push({
            type: 'tech',
            title: t.trim(),
            content: '',
            section: 'Tech Stack',
            metadata: {
              tags: ['tech', 'imported']
            }
          });
        }
      }
      continue;
    }

    // Heading (Section or Deep-Dive title)
    if (line.startsWith('#')) {
      const headingText = line.replace(/^#+\s*/, '').trim();
      if (headingText.toLowerCase().includes('deep dive') || headingText.toLowerCase().includes('deep-dive')) {
        currentSection = 'Deep-Dives';
      } else {
        currentSection = headingText;
      }
      continue;
    }

    // Regular Bullet Note
    if (line.match(/^[-*]\s*(.+)$/)) {
      const noteText = line.replace(/^[-*]\s*/, '').trim();
      items.push({
        type: 'note',
        title: noteText,
        content: '',
        section: currentSection,
        metadata: {
          tags: ['imported']
        }
      });
      continue;
    }

    // Standalone paragraph / note
    if (line.length > 0) {
      items.push({
        type: 'note',
        title: line.length > 80 ? line.slice(0, 77) + '...' : line,
        content: line.length > 80 ? line : '',
        section: currentSection,
        metadata: {
          tags: ['imported']
        }
      });
    }
  }

  // Calculate staggered grid positions so items don't overlap
  const COL_WIDTH = 340;
  const ROW_HEIGHT = 160;
  const COLS = 3;

  return items.map((item, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    return {
      ...item,
      metadata: {
        ...item.metadata,
        position: {
          x: 60 + col * COL_WIDTH,
          y: 80 + row * ROW_HEIGHT
        }
      }
    };
  });
}
