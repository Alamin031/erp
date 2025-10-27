import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Employee, EmployeeSkill, Skill, SkillsFilters, Proficiency } from "@/types/skill";
import { csvRowSchema, type CSVRow } from "@/lib/skills-validation";

interface SkillsState {
  skills: Skill[];
  employees: Employee[];
  assignments: EmployeeSkill[];

  filters: SkillsFilters;
  searchQuery: string;
  pagination: { page: number; pageSize: number };
  loading: boolean;
  error?: string;

  loadDemoData: () => Promise<void>;

  addSkill: (payload: Omit<Skill, "id" | "createdAt" | "updatedAt">) => { ok: boolean; message?: string };
  updateSkill: (id: string, payload: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  assignSkill: (employeeId: string, payload: { skillId: string; proficiency: Proficiency; acquiredAt?: string; lastUsedAt?: string; verified?: boolean }) => void;
  updateAssignment: (id: string, payload: Partial<EmployeeSkill>) => void;
  removeAssignment: (id: string) => void;

  addEndorsement: (assignmentId: string, endorsement: { by: string; note?: string }) => void;
  verifyAssignment: (id: string, verifierId: string) => void;

  setSearchQuery: (q: string) => void;
  setFilters: (f: Partial<SkillsFilters>) => void;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;

  importCSV: (file: File) => Promise<{ ok: boolean; imported: number; errors: string[] }>;
  exportCSV: (filters?: Partial<SkillsFilters>) => string;

  getMatrixData: (filters?: Partial<SkillsFilters>) => { employees: Employee[]; skills: Skill[]; values: Record<string, Record<string, Proficiency | 0>> };
  getAnalytics: (filters?: Partial<SkillsFilters>) => { avgBySkill: { name: string; avg: number }[]; countsByCategory: { name: string; count: number }[]; verifiedRate: number };
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function normalizeTagString(s?: string) {
  if (!s) return [] as string[];
  return s.split(/[|,]/).map(t => t.trim()).filter(Boolean);
}

export const useSkills = create<SkillsState>()(
  persist(
    (set, get) => ({
      skills: [],
      employees: [],
      assignments: [],

      filters: {},
      searchQuery: "",
      pagination: { page: 1, pageSize: 10 },
      loading: false,

      async loadDemoData() {
        try {
          set({ loading: true });
          const [skills, employees, endorsements] = await Promise.all([
            fetch("/demo/demoSkills.json").then(r => r.json()).catch(() => []),
            fetch("/demo/demoEmployees.json").then(r => r.json()).catch(() => []),
            fetch("/demo/demoEndorsements.json").then(r => r.json()).catch(() => []),
          ]);

          const now = new Date().toISOString();
          const skillsNorm: Skill[] = (skills || []).map((s: any) => ({
            id: s.id || uid("skill"),
            name: s.name,
            category: s.category,
            tags: s.tags || [],
            description: s.description,
            createdAt: s.createdAt || now,
            updatedAt: s.updatedAt,
          }));

          const employeesNorm: Employee[] = (employees || []).map((e: any) => ({
            id: e.id || uid("emp"),
            name: e.name,
            avatarUrl: e.avatarUrl,
            department: e.department,
            role: e.role,
          }));

          // Build some demo assignments deterministically
          const assignments: EmployeeSkill[] = [];
          employeesNorm.forEach((e, ei) => {
            const picked = skillsNorm.filter((_, si) => (ei + si) % 2 === 0).slice(0, 5);
            picked.forEach((s, pi) => {
              const proficiency = ((ei + pi) % 5) + 1 as Proficiency;
              assignments.push({
                id: uid("asg"),
                employeeId: e.id,
                skillId: s.id,
                proficiency,
                verified: proficiency >= 3 ? ((ei + pi) % 3 === 0) : false,
                endorsements: [],
                acquiredAt: new Date(Date.now() - (90 + (ei * 7 + pi) % 365) * 86400000).toISOString(),
                lastUsedAt: new Date(Date.now() - ((ei * 13 + pi) % 60) * 86400000).toISOString(),
              });
            });
          });

          // Merge endorsements demo if provided
          (endorsements || []).forEach((en: any) => {
            const match = assignments.find(a => a.employeeId === en.employeeId && a.skillId === en.skillId);
            if (match) {
              match.endorsements.push({ by: en.by, note: en.note, at: en.at || now });
            }
          });

          set({ skills: skillsNorm, employees: employeesNorm, assignments, loading: false });
        } catch (e) {
          console.error(e);
          set({ loading: false, error: "Failed to load demo data" });
        }
      },

      addSkill(payload) {
        const exists = get().skills.some(s => s.name.toLowerCase() === payload.name.toLowerCase());
        if (exists) return { ok: false, message: "Duplicate skill name" };
        const now = new Date().toISOString();
        const skill: Skill = { id: uid("skill"), createdAt: now, ...payload };
        set(state => ({ skills: [skill, ...state.skills] }));
        return { ok: true };
      },

      updateSkill(id, payload) {
        const now = new Date().toISOString();
        set(state => ({ skills: state.skills.map(s => s.id === id ? { ...s, ...payload, updatedAt: now } : s) }));
      },

      deleteSkill(id) {
        set(state => ({
          skills: state.skills.filter(s => s.id !== id),
          assignments: state.assignments.filter(a => a.skillId !== id),
        }));
      },

      assignSkill(employeeId, payload) {
        const id = uid("asg");
        const asg: EmployeeSkill = {
          id,
          employeeId,
          skillId: payload.skillId,
          proficiency: payload.proficiency,
          verified: !!payload.verified,
          endorsements: [],
          acquiredAt: payload.acquiredAt,
          lastUsedAt: payload.lastUsedAt,
        };
        set(state => ({ assignments: [asg, ...state.assignments] }));
      },

      updateAssignment(id, payload) {
        set(state => ({ assignments: state.assignments.map(a => a.id === id ? { ...a, ...payload } : a) }));
      },

      removeAssignment(id) {
        set(state => ({ assignments: state.assignments.filter(a => a.id !== id) }));
      },

      addEndorsement(assignmentId, endorsement) {
        const now = new Date().toISOString();
        set(state => ({
          assignments: state.assignments.map(a => a.id === assignmentId ? {
            ...a,
            endorsements: [{ by: endorsement.by, note: endorsement.note, at: now }, ...a.endorsements],
          } : a)
        }));
      },

      verifyAssignment(id, verifierId) {
        set(state => ({ assignments: state.assignments.map(a => a.id === id ? { ...a, verified: true, endorsements: [{ by: verifierId, note: "Verified", at: new Date().toISOString() }, ...a.endorsements] } : a) }));
      },

      setSearchQuery(q) { set({ searchQuery: q, pagination: { ...get().pagination, page: 1 } }); },
      setFilters(f) { set({ filters: { ...get().filters, ...f }, pagination: { ...get().pagination, page: 1 } }); },
      setPage(p) { set({ pagination: { ...get().pagination, page: p } }); },
      setPageSize(s) { set({ pagination: { page: 1, pageSize: s } }); },

      async importCSV(file) {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length <= 1) return { ok: false, imported: 0, errors: ["Empty CSV"] };
        const header = lines[0].split(",").map(h => h.trim());
        const required = ["employeeName","skillName","proficiency"];
        const missing = required.filter(k => !header.includes(k));
        if (missing.length) return { ok: false, imported: 0, errors: ["Missing columns: "+missing.join(", ")] };

        const rows = lines.slice(1).map(l => Object.fromEntries(header.map((h, i) => [h, (l.split(",")[i] || "").trim()])));
        const errors: string[] = [];
        let imported = 0;

        const state = get();
        const employees = [...state.employees];
        const skills = [...state.skills];
        const assignments = [...state.assignments];

        rows.forEach((raw, idx) => {
          const parse = csvRowSchema.safeParse(raw);
          if (!parse.success) {
            errors.push(`Row ${idx+2} invalid`);
            return;
          }
          const r: CSVRow = parse.data;

          // ensure employee
          let emp = employees.find(e => e.name.toLowerCase() === r.employeeName.toLowerCase());
          if (!emp) {
            emp = { id: uid("emp"), name: r.employeeName, department: r.department, role: r.role };
            employees.push(emp);
          }

          // ensure skill
          let sk = skills.find(s => s.name.toLowerCase() === r.skillName.toLowerCase());
          if (!sk) {
            sk = { id: uid("skill"), name: r.skillName, category: r.category, tags: normalizeTagString(r.tags), createdAt: new Date().toISOString() } as Skill;
            skills.push(sk);
          }

          const asg: EmployeeSkill = {
            id: uid("asg"),
            employeeId: emp.id,
            skillId: sk.id,
            proficiency: r.proficiency as Proficiency,
            verified: !!r.verified,
            endorsements: r.endorsementBy ? [{ by: r.endorsementBy, note: r.endorsementNote, at: new Date().toISOString() }] : [],
            acquiredAt: r.acquiredAt,
            lastUsedAt: r.lastUsedAt,
          };
          assignments.push(asg);
          imported++;
        });

        set({ employees, skills, assignments });
        return { ok: errors.length === 0, imported, errors };
      },

      exportCSV(filters) {
        const { employees, skills } = get();
        const asg = get().assignments.filter(a => {
          const f = { ...get().filters, ...filters };
          const emp = employees.find(e => e.id === a.employeeId);
          const sk = skills.find(s => s.id === a.skillId);
          if (!emp || !sk) return false;
          if (f.category && sk.category !== f.category) return false;
          if (f.department && emp.department !== f.department) return false;
          if (f.verified !== undefined && a.verified !== f.verified) return false;
          if (f.proficiencyMin && a.proficiency < f.proficiencyMin) return false;
          return true;
        });

        const header = ["employeeName","department","role","skillName","category","tags","proficiency","verified","acquiredAt","lastUsedAt"];
        const lines = [header.join(",")];
        asg.forEach(a => {
          const emp = employees.find(e => e.id === a.employeeId)!;
          const sk = skills.find(s => s.id === a.skillId)!;
          const row = [
            emp.name || "",
            emp.department || "",
            emp.role || "",
            sk.name || "",
            sk.category || "",
            (sk.tags || []).join("|"),
            String(a.proficiency),
            String(a.verified),
            a.acquiredAt || "",
            a.lastUsedAt || "",
          ];
          lines.push(row.map(v => `${v}`.replace(/,/g, ";")).join(","));
        });
        return lines.join("\n");
      },

      getMatrixData(filters) {
        const f = { ...get().filters, ...filters };
        const { employees, skills, assignments } = get();
        const filteredSkills = f.category ? skills.filter(s => s.category === f.category) : skills;
        const filteredEmployees = f.department ? employees.filter(e => e.department === f.department) : employees;
        const values: Record<string, Record<string, Proficiency | 0>> = {};

        filteredEmployees.forEach(e => {
          values[e.id] = {} as Record<string, Proficiency | 0>;
          filteredSkills.forEach(s => { values[e.id][s.id] = 0; });
        });

        assignments.forEach(a => {
          const included = filteredEmployees.some(e => e.id === a.employeeId) && filteredSkills.some(s => s.id === a.skillId);
          if (!included) return;
          if (f.proficiencyMin && a.proficiency < f.proficiencyMin) return;
          if (f.verified !== undefined && a.verified !== f.verified) return;
          values[a.employeeId][a.skillId] = a.proficiency;
        });

        return { employees: filteredEmployees, skills: filteredSkills, values };
      },

      getAnalytics(filters) {
        const { employees, skills, assignments } = get();
        const f = { ...get().filters, ...filters };
        const bySkill: Record<string, { total: number; count: number }> = {};
        const byCategory: Record<string, number> = {};
        let verifiedCount = 0;
        let totalAsg = 0;

        assignments.forEach(a => {
          const emp = employees.find(e => e.id === a.employeeId);
          const sk = skills.find(s => s.id === a.skillId);
          if (!emp || !sk) return;
          if (f.category && sk.category !== f.category) return;
          if (f.department && emp.department !== f.department) return;
          if (f.proficiencyMin && a.proficiency < f.proficiencyMin) return;
          totalAsg++;
          if (a.verified) verifiedCount++;
          bySkill[sk.name] = bySkill[sk.name] || { total: 0, count: 0 };
          bySkill[sk.name].total += a.proficiency;
          bySkill[sk.name].count += 1;
          if (sk.category) byCategory[sk.category] = (byCategory[sk.category] || 0) + 1;
        });

        const avgBySkill = Object.entries(bySkill).map(([name, v]) => ({ name, avg: v.count ? v.total / v.count : 0 })).sort((a, b) => b.avg - a.avg).slice(0, 12);
        const countsByCategory = Object.entries(byCategory).map(([name, count]) => ({ name, count })).sort((a,b)=> b.count - a.count);
        const verifiedRate = totalAsg ? Math.round((verifiedCount / totalAsg) * 100) : 0;
        return { avgBySkill, countsByCategory, verifiedRate };
      },

    }), { name: "skills-store" })
  );
