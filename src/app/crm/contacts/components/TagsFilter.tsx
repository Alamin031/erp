"use client";

import { useContacts } from "@/store/useContacts";

export function TagsFilter() {
  const { tags, filters, setTags: setTagsFromStore, setFilters } = useContacts();

  // simple multi-select UI
  const toggleTag = (tagName: string) => {
    const current = filters.tags || [];
    const exists = current.includes(tagName);
    const next = exists ? current.filter(t => t !== tagName) : [...current, tagName];
    setFilters({ ...filters, tags: next });
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
      {tags.map(t => (
        <button key={t.id} onClick={() => toggleTag(t.name)} className="btn" style={{ padding: '6px 10px', borderRadius: 999 }}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
