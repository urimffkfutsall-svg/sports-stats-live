// DEPRECATED: Migrated to MongoDB API. Kept as stub to avoid breaking imports.
// All real calls should use @/lib/api-db.
const noop = () => Promise.resolve({ data: null, error: new Error("supabase deprecated - use api-db") });
const noopUpload = () => Promise.resolve({ data: null, error: new Error("supabase deprecated - use api-db uploadFile") });

const queryBuilder: any = {
  select: () => ({ ...queryBuilder, then: (cb: any) => cb({ data: [], error: null }) }),
  insert: noop, update: () => queryBuilder, delete: () => queryBuilder,
  eq: () => queryBuilder, order: () => queryBuilder, single: noop,
  then: (cb: any) => cb({ data: [], error: null }),
};

export const supabase = {
  from: () => queryBuilder,
  storage: { from: () => ({ upload: noopUpload, remove: noop, getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
  auth: { signIn: noop, signOut: noop, getUser: noop, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
  channel: () => ({ on: () => ({ subscribe: () => ({}) }), subscribe: () => ({}) }),
  removeChannel: () => {},
};