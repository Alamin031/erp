"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSkills } from "@/store/useSkills";
import { skillFormSchema, type SkillFormInput } from "@/lib/skills-validation";
import { useToast } from "@/components/toast";

interface Props {
  open: boolean;
  editId?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export function SkillFormModal({ open, editId, onClose, onSaved }: Props) {
  const { addSkill, updateSkill, skills } = useSkills();
  const { showToast } = useToast();

  const editing = skills.find(s => s.id === editId);
  const [tagsInput, setTagsInput] = useState<string>(editing ? (editing.tags || []).join(", ") : "");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SkillFormInput>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: editing ? { name: editing.name, category: editing.category || "", tags: editing.tags || [], description: editing.description || "" } : { name: "", category: "", tags: [], description: "" },
  });

  useEffect(() => {
    if (editing) {
      reset({ name: editing.name, category: editing.category || "", tags: editing.tags || [], description: editing.description || "" });
      setTagsInput((editing.tags || []).join(", "));
    }
  }, [editId]);

  async function onSubmit(values: SkillFormInput) {
    const tags = tagsInput.split(',').map(s=> s.trim()).filter(Boolean);
    if (editing) {
      updateSkill(editId!, { ...values, tags });
      showToast({ title: "Skill updated", type: "success" });
      onSaved?.();
      return;
    }
    const res = addSkill({ ...values, tags });
    if (!res.ok) {
      showToast({ title: res.message || "Failed", type: "error" });
      return;
    }
    onSaved?.();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="text-slate-100 font-semibold">{editing ? "Edit Skill" : "New Skill"}</h3>
            <button aria-label="Close" onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1" htmlFor="name">Name</label>
              <input id="name" aria-invalid={!!errors.name} {...register("name")} className="w-full rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60" />
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1" htmlFor="category">Category</label>
              <input id="category" {...register("category")} className="w-full rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1" htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                value={tagsInput}
                onChange={(e)=> setTagsInput(e.target.value)}
                placeholder="frontend, web"
                className="w-full rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1" htmlFor="description">Description</label>
              <textarea id="description" rows={3} {...register("description")} className="w-full rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700">Cancel</button>
              <button disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400">{editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
