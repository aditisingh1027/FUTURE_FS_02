const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Lead = require('../models/Lead');

dotenv.config();

const normalizeNotes = (notes) => {
  if (notes == null) return null;

  if (Array.isArray(notes)) {
    // Convert array elements into valid note objects
    const out = [];
    for (const n of notes) {
      if (n == null) continue;
      if (typeof n === 'string') {
        const s = n.trim();
        if (s) out.push({ content: s, createdAt: new Date() });
      } else if (typeof n === 'object') {
        // Accept object with content string
        if (typeof n.content === 'string' && n.content.trim()) {
          out.push({ content: n.content.trim(), createdAt: n.createdAt ? new Date(n.createdAt) : new Date() });
        } else if (typeof n.text === 'string' && n.text.trim()) {
          out.push({ content: n.text.trim(), createdAt: n.createdAt ? new Date(n.createdAt) : new Date() });
        } else if (Object.keys(n).length > 0) {
          // Try to stringify non-empty object into content
          try {
            const str = JSON.stringify(n);
            out.push({ content: str, createdAt: new Date() });
          } catch (e) {
            // skip
          }
        }
      }
    }
    return out;
  }

  if (typeof notes === 'string') {
    const s = notes.trim();
    if (s) return [{ content: s, createdAt: new Date() }];
    return [];
  }

  if (typeof notes === 'object') {
    if (typeof notes.content === 'string' && notes.content.trim()) return [{ content: notes.content.trim(), createdAt: notes.createdAt ? new Date(notes.createdAt) : new Date() }];
    if (typeof notes.text === 'string' && notes.text.trim()) return [{ content: notes.text.trim(), createdAt: notes.createdAt ? new Date(notes.createdAt) : new Date() }];
    try {
      const str = JSON.stringify(notes);
      return [{ content: str, createdAt: new Date() }];
    } catch (e) {
      return [];
    }
  }

  return null;
};

(async () => {
  await connectDB();
  console.log('Scanning leads for malformed notes...');

  const leads = await Lead.find({}).lean();
  const malformed = [];
  const fixes = [];

  for (const lead of leads) {
    const original = lead.notes;
    // Check if original is array of objects with content
    let isValid = false;
    if (Array.isArray(original) && original.length > 0) {
      isValid = original.every((el) => el && typeof el === 'object' && typeof el.content === 'string');
    } else if (Array.isArray(original) && original.length === 0) {
      // empty array is valid
      isValid = true;
    }

    if (!isValid) {
      malformed.push({ _id: lead._id, name: lead.name, email: lead.email, notes: original });
      const normalized = normalizeNotes(original);
      if (normalized != null) {
        // Update only if normalized differs or original not array
        const needUpdate = !Array.isArray(original) || JSON.stringify(normalized) !== JSON.stringify(original);
        if (needUpdate) {
          try {
            await Lead.updateOne({ _id: lead._id }, { $set: { notes: normalized } });
            fixes.push({ _id: lead._id, name: lead.name, changedTo: normalized });
          } catch (e) {
            console.error('Failed to update lead', lead._id.toString(), e.message);
          }
        }
      }
    }
  }

  console.log(`Found ${malformed.length} malformed leads.`);
  if (malformed.length > 0) {
    console.log('Malformed records:');
    malformed.forEach((m) => {
      console.log(` - ${m._id} | ${m.name} <${m.email}> | notes: ${JSON.stringify(m.notes)}`);
    });
  }

  console.log(`Applied fixes to ${fixes.length} leads.`);
  if (fixes.length > 0) {
    fixes.forEach((f) => {
      console.log(` - ${f._id} | ${f.name} | new notes: ${JSON.stringify(f.changedTo)}`);
    });
  }

  console.log('Done.');
  process.exit(0);
})();
