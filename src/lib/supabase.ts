// ============================================================
// "supabase" compatibility shim — MongoDB është baza reale (shih
// supabase-db.ts). Ky skedar ekziston vetëm sepse AdminNews.tsx ende
// importon `{ supabase }` direkt për upload fotosh. E emulojmë storage-in
// duke konvertuar file-in në base64 (data-URI) — asnjë URL/kredencial
// Supabase s'përdoret më askund.
// ============================================================

const _uploadCache = new Map<string, string>();

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function makeBucket(bucket: string) {
  return {
    async upload(path: string, file: File, _opts?: any) {
      try {
        const dataUrl = await fileToBase64(file);
        _uploadCache.set(`${bucket}/${path}`, dataUrl);
        return { data: { path }, error: null };
      } catch (e: any) {
        return { data: null, error: e };
      }
    },
    async remove(paths: string[]) {
      paths.forEach(p => _uploadCache.delete(`${bucket}/${p}`));
      return { data: null, error: null };
    },
    getPublicUrl(path: string) {
      return { data: { publicUrl: _uploadCache.get(`${bucket}/${path}`) || '' } };
    },
  };
}

export const supabase = {
  storage: {
    from: (bucket: string) => makeBucket(bucket),
  },
  from(table: string) {
    const notSupported = () => {
      throw new Error(`supabase.from('${table}') nuk mbështetet më (baza është MongoDB). Përdor modulet dbXxx nga '@/lib/supabase-db'.`);
    };
    return { select: notSupported, insert: notSupported, update: notSupported, delete: notSupported };
  },
};
