const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, LevelFormat, convertInchesToTwip
} = D;

const CONTENT_W = 9638;               // A4 minus margins, in DXA
const MONO = 'Consolas';
const BODY = 'Segoe UI';
const INK  = '0D2137';
const BRASS= 'A8741A';
const RULE = 'B3AC9C';
const SHADE= 'F0ECE2';
const CODEBG='F2F0EA';

/* ---------- inline ---------- */
function inline(text, base = {}) {
  const runs = [];
  // links -> label only
  text = text.replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1');
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m;
  const push = (t, extra) => {
    if (!t) return;
    runs.push(new TextRun({ text: t, font: BODY, size: 22, rightToLeft: true, ...base, ...extra }));
  };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) {
      push(tok.slice(2, -2), { bold: true, color: INK });
    } else {
      runs.push(new TextRun({
        text: tok.slice(1, -1), font: MONO, size: 19,
        rightToLeft: false, shading: { type: ShadingType.CLEAR, fill: CODEBG }, ...base
      }));
    }
    last = m.index + tok.length;
  }
  push(text.slice(last));
  if (!runs.length) push('');
  return runs;
}

const P = (text, opts = {}) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.RIGHT,
  spacing: { after: 120, line: 300 },
  children: inline(text), ...opts
});

/* ---------- table ---------- */
function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim());
}
function buildTable(rows) {
  const header = splitRow(rows[0]);
  const bodyRows = rows.slice(2).map(splitRow);
  const n = Math.max(header.length, ...bodyRows.map(r => r.length), 1);
  const w = Math.floor(CONTENT_W / n);
  const widths = Array(n).fill(w);
  widths[n - 1] = CONTENT_W - w * (n - 1);

  const cell = (txt, isHead, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: isHead ? { type: ShadingType.CLEAR, fill: SHADE } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({
      bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 0, line: 260 },
      children: inline(txt || '', isHead ? { bold: true, color: INK, size: 20 } : { size: 20 })
    })]
  });

  const pad = r => { const c = r.slice(0, n); while (c.length < n) c.push(''); return c; };

  return new Table({
    columnWidths: widths,
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: ['top','bottom','left','right','insideHorizontal','insideVertical'].reduce((o, k) => {
      o[k] = { style: BorderStyle.SINGLE, size: 4, color: RULE }; return o;
    }, {}),
    rows: [
      new TableRow({ tableHeader: true, children: pad(header).map((t, i) => cell(t, true, i)) }),
      ...bodyRows.map(r => new TableRow({ children: pad(r).map((t, i) => cell(t, false, i)) }))
    ]
  });
}

/* ---------- parse ---------- */
function parse(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  const HEAD = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3,
                HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // code fence
    if (/^\s*```/.test(line)) {
      i++;
      const buf = [];
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      buf.forEach((t, k) => out.push(new Paragraph({
        alignment: AlignmentType.LEFT, bidirectional: false,
        spacing: { after: 0, line: 250, before: k === 0 ? 100 : 0 },
        shading: { type: ShadingType.CLEAR, fill: CODEBG },
        border: {
          left: { style: BorderStyle.SINGLE, size: 12, color: BRASS, space: 6 },
          top: k === 0 ? { style: BorderStyle.SINGLE, size: 2, color: 'DDD8CC', space: 3 } : undefined,
          bottom: k === buf.length - 1 ? { style: BorderStyle.SINGLE, size: 2, color: 'DDD8CC', space: 3 } : undefined
        },
        children: [new TextRun({ text: t || ' ', font: MONO, size: 18, rightToLeft: false })]
      })));
      out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }

    // heading
    let m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      const lvl = m[1].length;
      out.push(new Paragraph({
        heading: HEAD[lvl - 1], bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { before: lvl === 1 ? 0 : 260, after: 120 },
        border: lvl <= 2 ? { bottom: { style: BorderStyle.SINGLE, size: lvl === 1 ? 12 : 4, color: lvl === 1 ? BRASS : RULE, space: 4 } } : undefined,
        children: inline(m[2], { bold: true, color: INK, size: lvl === 1 ? 34 : lvl === 2 ? 27 : 23 })
      }));
      i++; continue;
    }

    // hr
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      out.push(new Paragraph({
        spacing: { before: 160, after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 1 } },
        children: []
      }));
      i++; continue;
    }

    // table
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      out.push(buildTable(rows));
      out.push(new Paragraph({ spacing: { after: 140 }, children: [] }));
      continue;
    }

    // blockquote
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      buf.filter(t => t.trim()).forEach(t => out.push(new Paragraph({
        bidirectional: true, alignment: AlignmentType.RIGHT,
        spacing: { after: 80, line: 290 },
        indent: { right: 200 },
        shading: { type: ShadingType.CLEAR, fill: 'FAF7F0' },
        border: { right: { style: BorderStyle.SINGLE, size: 14, color: BRASS, space: 6 } },
        children: inline(t)
      })));
      out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }

    // list
    m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (m) {
      while (i < lines.length) {
        const mm = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
        if (!mm) break;
        const depth = Math.min(Math.floor(mm[1].length / 2), 2);
        const ordered = /\d/.test(mm[2]);
        out.push(new Paragraph({
          bidirectional: true, alignment: AlignmentType.RIGHT,
          spacing: { after: 60, line: 290 },
          numbering: { reference: ordered ? 'num-ol' : 'num-ul', level: depth },
          children: inline(mm[3])
        }));
        i++;
      }
      continue;
    }

    // paragraph (gather until blank / block start)
    const buf = [];
    while (i < lines.length && lines[i].trim() &&
           !/^\s*(#{1,6}\s|```|>|\||([-*+]|\d+[.)])\s)/.test(lines[i]) &&
           !/^\s*([-*_])\1{2,}\s*$/.test(lines[i])) {
      buf.push(lines[i++].trim());
    }
    if (buf.length) out.push(P(buf.join(' ')));
    else i++;
  }
  return out;
}

/* ---------- build ---------- */
const numbering = {
  config: [
    { reference: 'num-ul', levels: [0,1,2].map(l => ({
        level: l, format: LevelFormat.BULLET, text: ['•','◦','▪'][l], alignment: AlignmentType.RIGHT,
        style: { paragraph: { indent: { right: convertInchesToTwip(0.3*(l+1)), hanging: 260 } } } })) },
    { reference: 'num-ol', levels: [0,1,2].map(l => ({
        level: l, format: LevelFormat.DECIMAL, text: `%${l+1}.`, alignment: AlignmentType.RIGHT,
        style: { paragraph: { indent: { right: convertInchesToTwip(0.3*(l+1)), hanging: 300 } } } })) }
  ]
};

const src = process.argv[2], dst = process.argv[3], label = process.argv[4] || path.basename(src);
const md = fs.readFileSync(src, 'utf8');

const doc = new Document({
  creator: 'Innova Smart Solutions',
  title: path.basename(src, '.md'),
  description: 'نظام ماجد كرف العقاري',
  numbering,
  styles: { default: { document: { run: { font: BODY, size: 22 }, paragraph: { spacing: { line: 300 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: [
      ...parse(md),
      new Paragraph({
        spacing: { before: 320 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 6 } },
        bidirectional: true, alignment: AlignmentType.RIGHT,
        children: [new TextRun({
          text: `نظام ماجد كرف — Location jo8GkEPOGeRVWN5khioH · المصدر: ${label}`,
          font: BODY, size: 16, color: '7B8794', rightToLeft: true })]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(dst, b); console.log('✓', path.basename(dst)); });
