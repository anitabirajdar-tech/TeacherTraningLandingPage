// Fixes garbled emoji in Dashboard.jsx
// Root cause: PowerShell Get-Content read UTF-8 file without BOM as Windows-1252,
// then Set-Content -Encoding UTF8 wrote those misread chars as UTF-8.
// Fix: for each non-ASCII char, look up its Windows-1252 byte value, then
// re-decode the resulting byte array as UTF-8.

const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'src/pages/Dashboard.jsx')
let c = fs.readFileSync(filePath, 'utf8')
if (c.charCodeAt(0) === 0xFEFF) c = c.slice(1)  // strip BOM if present

// Windows-1252 special characters (0x80-0x9F) that differ from ISO-8859-1
// Includes "undefined" bytes that PowerShell maps to their C1 control code points
const cp1252SpecialRT = {   // Unicode codepoint → Windows-1252 byte
  0x0081: 0x81, // undefined → U+0081
  0x008D: 0x8D, // undefined → U+008D (REVERSE LINE FEED)
  0x008F: 0x8F, // undefined → U+008F
  0x0090: 0x90, // undefined → U+0090
  0x009D: 0x9D, // undefined → U+009D
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
  0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
  0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
  0x017E: 0x9E, 0x0178: 0x9F,
}

function charToCP1252Byte(cp) {
  if (cp < 0x80) return cp                 // ASCII
  if (cp >= 0xA0 && cp <= 0xFF) return cp  // Latin-1 supplement (same in CP1252)
  if (cp1252SpecialRT[cp] !== undefined) return cp1252SpecialRT[cp]
  return null  // not encodable
}

function tryFixNonAsciiRun(str) {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    const byte = charToCP1252Byte(str.charCodeAt(i))
    if (byte === null) return str  // can't encode → leave unchanged
    bytes.push(byte)
  }
  try {
    const fixed = Buffer.from(bytes).toString('utf8')
    if (fixed.includes('\uFFFD')) return str  // invalid UTF-8 sequence → leave unchanged
    return fixed
  } catch {
    return str
  }
}

// Only process non-ASCII runs (preserve ASCII/JSX structure)
const result = c.replace(/[^\x00-\x7F]+/g, tryFixNonAsciiRun)

fs.writeFileSync(filePath, result, 'utf8')
console.log('Fixed. Lines:', result.split('\n').length)

// Quick sanity check: show the STATUS_LABELS block
const i = result.indexOf('STATUS_LABELS')
if (i !== -1) console.log('\nSTATUS_LABELS preview:\n' + result.slice(i, i + 200))
