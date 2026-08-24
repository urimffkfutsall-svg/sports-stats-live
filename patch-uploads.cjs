const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'supabase-db.ts');
let content = fs.readFileSync(filePath, 'utf8');

const marker = '// ============ FILE "UPLOAD" (base64, ngjitur direkt te dokumenti) ============';
const endMarker = '// ============ POLLING-BASED "REAL-TIME"';

const startIdx = content.indexOf(marker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('GABIM: nuk u gjeten markuesit e pritur ne supabase-db.ts.');
  console.error('startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

const before = content.slice(0, startIdx);
const after = content.slice(endIdx);

const replacement = `// ============ FILE UPLOAD (Supabase Storage bucket media) ============
import { supabaseClient } from './supabaseClient';

async function uploadToMediaBucket(file, folder, id) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = folder + '/' + id + '-' + Date.now() + '.' + ext;
  const { error } = await supabaseClient.storage
    .from('media')
    .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type || undefined });
  if (error) throw error;
  const { data } = supabaseClient.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadTeamLogo(file, teamId) {
  return uploadToMediaBucket(file, 'team-logos', teamId);
}

export async function uploadPlayerPhoto(file, playerId) {
  return uploadToMediaBucket(file, 'player-photos', playerId);
}

`;

const newContent = before + replacement + after;
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('U rregullua supabase-db.ts me sukses.');
