/**
 * migrate-team-logos.cjs
 *
 * Zhvendos logot base64 te teams[] nga kolona app_data.data (JSONB)
 * ne Supabase Storage bucket "team-logo", dhe i zevendeson ne JSON
 * me URL publike.
 *
 * PERDORIM:
 *   node migrate-team-logos.cjs           -> DRY RUN (nuk shkruan asgje, vetem raporton)
 *   node migrate-team-logos.cjs --apply    -> e kryen migrimin realisht
 *
 * Kerkon .env.local me SUPABASE_URL dhe SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ---- Ngarko .env.local manualisht (pa varesi shtese) ----
function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('GABIM: .env.local nuk u gjet ne', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}
loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'team-logo';
const APPLY = process.argv.includes('--apply');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('GABIM: SUPABASE_URL ose SUPABASE_SERVICE_KEY mungon ne .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseBase64DataUrl(dataUrl) {
  // p.sh: data:image/png;base64,iVBORw0KGgo...
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  let ext = mime.split('/')[1] || 'png';
  if (ext === 'svg+xml') ext = 'svg';
  if (ext === 'jpeg') ext = 'jpg';
  return { mime, buffer, ext };
}

async function main() {
  console.log(`Modaliteti: ${APPLY ? 'APPLY (do te shkruaje realisht)' : 'DRY RUN (vetem raport)'}`);
  console.log('Duke lexuar app_data...');

  const { data: row, error: readErr } = await supabase
    .from('app_data')
    .select('data')
    .eq('key', 'main')
    .single();

  if (readErr) {
    console.error('GABIM ne lexim:', readErr.message);
    process.exit(1);
  }

  const blob = row.data || {};
  const teams = Array.isArray(blob.teams) ? blob.teams : [];

  if (teams.length === 0) {
    console.log('Nuk ka teams[] ne blob. Duke dale.');
    return;
  }

  console.log(`Gjeta ${teams.length} skuadra.`);

  // ---- Backup lokal para se te prekim asgje ----
  const backupPath = path.join(
    __dirname,
    `teams-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  fs.writeFileSync(backupPath, JSON.stringify(teams, null, 2), 'utf8');
  console.log(`Backup i teams[] u ruajt ne: ${backupPath}`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const logo = team.logo;

    if (typeof logo !== 'string' || !logo.startsWith('data:image/')) {
      skipped++;
      continue;
    }

    const parsed = parseBase64DataUrl(logo);
    if (!parsed) {
      console.warn(`  [${i}] "${team.name || team.id}": logo base64 s'u parsua dot, po kalohet.`);
      failed++;
      continue;
    }

    bytesBefore += parsed.buffer.length;

    const safeId = team.id || `team-${i}`;
    const fileName = `${safeId}.${parsed.ext}`;

    console.log(
      `  [${i}] "${team.name || safeId}": ${(parsed.buffer.length / 1024).toFixed(1)} KB -> ${fileName}`
    );

    if (APPLY) {
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, parsed.buffer, {
          contentType: parsed.mime,
          upsert: true,
        });

      if (uploadErr) {
        console.error(`    GABIM upload per "${team.name}":`, uploadErr.message);
        failed++;
        continue;
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      const publicUrl = pub.publicUrl;

      team.logo = publicUrl;
      bytesAfter += publicUrl.length;
      migrated++;
    } else {
      // dry run: vetem numeroje
      migrated++;
      bytesAfter += 120; // vlere fiktive per raport (gjatesi tipike URL)
    }
  }

  console.log('\n--- RAPORT ---');
  console.log(`Migruar: ${migrated}`);
  console.log(`Kaluar (s'kishin base64): ${skipped}`);
  console.log(`Deshtuar: ${failed}`);
  console.log(`Peshë para: ${(bytesBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Peshë pas (vetem logo fields): ${(bytesAfter / 1024).toFixed(1)} KB`);

  if (!APPLY) {
    console.log('\nKy ishte DRY RUN. Asgje s\'u ndryshua ne databaze ose storage.');
    console.log('Per te aplikuar realisht, ekzekuto: node migrate-team-logos.cjs --apply');
    return;
  }

  if (failed > 0) {
    console.warn(`\nKUJDES: ${failed} logo deshtuan. Blob-i DUHET perditesuar prapeseprape per ato qe u migruan me sukses.`);
  }

  console.log('\nDuke ruajtur app_data te perditesuar...');
  blob.teams = teams;

  const { error: writeErr } = await supabase
    .from('app_data')
    .upsert(
      { key: 'main', data: blob, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (writeErr) {
    console.error('GABIM ne ruajtjen finale:', writeErr.message);
    console.error('Backup-i i teams origjinale eshte ende ne:', backupPath);
    process.exit(1);
  }

  console.log('U RUAJT ME SUKSES. Migrimi perfundoi.');
}

main().catch((e) => {
  console.error('GABIM I PAPRITUR:', e);
  process.exit(1);
});
