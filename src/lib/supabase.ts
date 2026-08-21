import { supabaseClient } from './supabaseClient';

const MEDIA_BUCKET = 'media';

function makeBucket(bucketName: string) {
  return {
    async upload(path: string, file: File, opts?: any) {
      const fullPath = `${bucketName}/${path}`;
      const { data, error } = await supabaseClient.storage
        .from(MEDIA_BUCKET)
        .upload(fullPath, file, {
          cacheControl: opts?.cacheControl || '3600',
          upsert: opts?.upsert ?? true,
          contentType: file.type || undefined,
        });
      if (error) return { data: null, error };
      return { data: { path }, error: null };
    },
    async remove(paths: string[]) {
      const fullPaths = paths.map(p => `${bucketName}/${p}`);
      const { error } = await supabaseClient.storage.from(MEDIA_BUCKET).remove(fullPaths);
      return { data: null, error };
    },
    getPublicUrl(path: string) {
      const fullPath = `${bucketName}/${path}`;
      const { data } = supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl(fullPath);
      return { data: { publicUrl: data.publicUrl } };
    },
  };
}

export const supabase = {
  storage: {
    from: (bucket: string) => makeBucket(bucket),
  },
  from(table: string) {
    const notSupported = () => {
      throw new Error(`supabase.from('${table}') nuk mbeshtetet me (baza eshte MongoDB). Perdor modulet dbXxx nga '@/lib/supabase-db'.`);
    };
    return { select: notSupported, insert: notSupported, update: notSupported, delete: notSupported };
  },
};
