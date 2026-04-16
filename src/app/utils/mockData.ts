// Mock data for the Negotium Card application

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  normalized_name: string;
  version: number;
}

export interface Department {
  id: string;
  company_id: string;
  parent_id: string | null;
  name: string;
  depth: number;
  version: number;
  children?: Department[];
}

export interface Position {
  id: string;
  name: string;
  level: number;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  department_id: string;
  position_id: string;
  company?: Company;
  department?: Department;
  position?: Position;
}

export interface Card {
  id: string;
  user_id: string;
  person_id: string;
  image_url: string;
  created_at: string;
  person?: Person;
}

export interface Memo {
  id: string;
  person_id: string;
  content: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Mock companies
export const mockCompanies: Company[] = [
  { id: "1", name: "Samsung Electronics", normalized_name: "samsung", version: 1 },
  { id: "2", name: "Naver Corporation", normalized_name: "naver", version: 1 },
  { id: "3", name: "Kakao Corp", normalized_name: "kakao", version: 1 },
];

// Mock positions
export const mockPositions: Position[] = [
  { id: "1", name: "Staff", level: 1 },
  { id: "2", name: "Senior", level: 2 },
  { id: "3", name: "Manager", level: 3 },
  { id: "4", name: "Director", level: 4 },
  { id: "5", name: "VP", level: 5 },
  { id: "6", name: "CTO", level: 6 },
];

// Mock departments (Samsung)
export const mockDepartments: Department[] = [
  { id: "1", company_id: "1", parent_id: null, name: "Technology Division", depth: 0, version: 1 },
  { id: "2", company_id: "1", parent_id: "1", name: "Cloud Platform Team", depth: 1, version: 1 },
  { id: "3", company_id: "1", parent_id: "1", name: "AI Research Team", depth: 1, version: 1 },
  { id: "4", company_id: "1", parent_id: "2", name: "Backend Squad", depth: 2, version: 1 },
  { id: "5", company_id: "1", parent_id: "2", name: "Frontend Squad", depth: 2, version: 1 },
  { id: "6", company_id: "1", parent_id: "3", name: "ML Engineering", depth: 2, version: 1 },
  
  { id: "7", company_id: "2", parent_id: null, name: "Engineering Division", depth: 0, version: 1 },
  { id: "8", company_id: "2", parent_id: "7", name: "Search Team", depth: 1, version: 1 },
  { id: "9", company_id: "2", parent_id: "7", name: "Commerce Team", depth: 1, version: 1 },
  
  { id: "10", company_id: "3", parent_id: null, name: "Technology Group", depth: 0, version: 1 },
  { id: "11", company_id: "3", parent_id: "10", name: "Talk Team", depth: 1, version: 1 },
];

// Mock persons
export const mockPersons: Person[] = [
  {
    id: "1",
    name: "김민수",
    email: "minsu.kim@samsung.com",
    phone: "010-1234-5678",
    company_id: "1",
    department_id: "2",
    position_id: "4",
  },
  {
    id: "2",
    name: "이서연",
    email: "seoyeon.lee@samsung.com",
    phone: "010-2345-6789",
    company_id: "1",
    department_id: "4",
    position_id: "3",
  },
  {
    id: "3",
    name: "박지훈",
    email: "jihun.park@samsung.com",
    phone: "010-3456-7890",
    company_id: "1",
    department_id: "5",
    position_id: "2",
  },
  {
    id: "4",
    name: "최유진",
    email: "yujin.choi@samsung.com",
    phone: "010-4567-8901",
    company_id: "1",
    department_id: "3",
    position_id: "4",
  },
  {
    id: "5",
    name: "정현우",
    email: "hyunwoo.jung@naver.com",
    phone: "010-5678-9012",
    company_id: "2",
    department_id: "8",
    position_id: "3",
  },
  {
    id: "6",
    name: "강다은",
    email: "daeun.kang@naver.com",
    phone: "010-6789-0123",
    company_id: "2",
    department_id: "9",
    position_id: "2",
  },
  {
    id: "7",
    name: "윤서준",
    email: "seojun.yoon@kakao.com",
    phone: "010-7890-1234",
    company_id: "3",
    department_id: "11",
    position_id: "5",
  },
  {
    id: "8",
    name: "한채원",
    email: "chaewon.han@samsung.com",
    phone: "010-8901-2345",
    company_id: "1",
    department_id: "6",
    position_id: "2",
  },
];

// Mock cards
export const mockCards: Card[] = [
  {
    id: "1",
    user_id: "user1",
    person_id: "1",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    created_at: "2026-03-10T10:00:00Z",
  },
  {
    id: "2",
    user_id: "user1",
    person_id: "2",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    created_at: "2026-03-09T14:30:00Z",
  },
  {
    id: "3",
    user_id: "user1",
    person_id: "3",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    created_at: "2026-03-08T09:15:00Z",
  },
  {
    id: "4",
    user_id: "user1",
    person_id: "4",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    created_at: "2026-03-07T16:45:00Z",
  },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: "1", name: "고객사", color: "#3B82F6" },
  { id: "2", name: "핵심인물", color: "#EF4444" },
  { id: "3", name: "개발팀", color: "#10B981" },
  { id: "4", name: "의사결정자", color: "#F59E0B" },
  { id: "5", name: "파트너", color: "#8B5CF6" },
];

// Mock memos
export const mockMemos: Memo[] = [
  {
    id: "1",
    person_id: "1",
    content: "클라우드 플랫폼 담당 디렉터. 의사결정권자.",
    created_at: "2026-03-10T10:30:00Z",
  },
  {
    id: "2",
    person_id: "2",
    content: "백엔드 아키텍처 전문가. 기술 협업 필요.",
    created_at: "2026-03-09T15:00:00Z",
  },
];

// Helper function to get person with relations
export const getPersonWithRelations = (personId: string): Person | null => {
  const person = mockPersons.find(p => p.id === personId);
  if (!person) return null;

  return {
    ...person,
    company: mockCompanies.find(c => c.id === person.company_id),
    department: mockDepartments.find(d => d.id === person.department_id),
    position: mockPositions.find(p => p.id === person.position_id),
  };
};

// Helper function to build department tree
export const buildDepartmentTree = (companyId: string): Department[] => {
  const depts = mockDepartments.filter(d => d.company_id === companyId);
  const rootDepts = depts.filter(d => d.parent_id === null);
  
  const buildChildren = (parentId: string): Department[] => {
    return depts
      .filter(d => d.parent_id === parentId)
      .map(d => ({
        ...d,
        children: buildChildren(d.id),
      }));
  };
  
  return rootDepts.map(d => ({
    ...d,
    children: buildChildren(d.id),
  }));
};

// Helper function to get persons by department
export const getPersonsByDepartment = (departmentId: string): Person[] => {
  return mockPersons
    .filter(p => p.department_id === departmentId)
    .map(p => getPersonWithRelations(p.id)!);
};
