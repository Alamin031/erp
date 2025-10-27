export type Proficiency = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category?: string;
  tags?: string[];
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string;
  department?: string;
  role?: string;
}

export interface EndorsementEntry {
  by: string;
  note?: string;
  at: string;
}

export interface EmployeeSkill {
  id: string;
  employeeId: string;
  skillId: string;
  proficiency: Proficiency;
  verified: boolean;
  endorsements: EndorsementEntry[];
  acquiredAt?: string;
  lastUsedAt?: string;
}

export interface SkillsFilters {
  category?: string;
  proficiencyMin?: Proficiency;
  department?: string;
  verified?: boolean;
  lastUsedAfter?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
}
