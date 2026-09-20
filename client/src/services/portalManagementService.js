import { DEMO_EMPLOYEES } from '../data/demoEmployees';

export const DEPARTMENTS = [
  { id: 'all', name: 'All Departments', code: 'ALL' },
  { id: 'mospi', name: 'MoSPI / National Statistical Office', code: 'MoSPI-NSO', ministry: 'Ministry of Statistics & Programme Implementation' },
  { id: 'agri', name: 'Ministry of Agriculture (DES)', code: 'DA&FW', ministry: 'Ministry of Agriculture & Farmers Welfare' },
  { id: 'health', name: 'Health & Family Welfare (MoHFW)', code: 'MoHFW', ministry: 'Ministry of Health & Family Welfare' },
  { id: 'labour', name: 'Ministry of Labour & Employment', code: 'MoLE', ministry: 'Ministry of Labour & Employment' },
  { id: 'education', name: 'Ministry of Education', code: 'MoE', ministry: 'Ministry of Education' },
];

const INITIAL_TRAINERS = [
  {
    id: 'tr-01',
    name: 'Dr. Rajeshwar Sharma',
    trainerId: 'TR-NSSTA-101',
    email: 'rajeshwar.sharma@nssta.gov.in',
    department: 'MoSPI / National Statistical Office',
    specialization: 'Survey Sampling & Geospatial Statistics',
    role: 'Chief Faculty & Domain Specialist',
    materialsCount: 6,
    activeBatches: 3,
    status: 'ACTIVE',
    rating: '4.9/5',
  },
  {
    id: 'tr-02',
    name: 'Dr. Sunita Deshmukh',
    trainerId: 'TR-AGRI-104',
    email: 'sunita.deshmukh@nic.in',
    department: 'Ministry of Agriculture (DES)',
    specialization: 'Crop Yield Modeling & Remote Sensing',
    role: 'Senior Training Specialist',
    materialsCount: 4,
    activeBatches: 2,
    status: 'ACTIVE',
    rating: '4.8/5',
  },
  {
    id: 'tr-03',
    name: 'Prof. Amit Varma',
    trainerId: 'TR-HLTH-108',
    email: 'amit.varma@mohfw.gov.in',
    department: 'Health & Family Welfare (MoHFW)',
    specialization: 'Public Health Informatics & Disease Surveillance',
    role: 'Faculty Lead',
    materialsCount: 3,
    activeBatches: 2,
    status: 'ACTIVE',
    rating: '4.7/5',
  },
  {
    id: 'tr-04',
    name: 'Ms. Meenakshi Sundaram',
    trainerId: 'TR-LABR-112',
    email: 'm.sundaram@labour.gov.in',
    department: 'Ministry of Labour & Employment',
    specialization: 'Periodic Labour Force Data & Wage Indices',
    role: 'Statistical Consultant & Trainer',
    materialsCount: 3,
    activeBatches: 1,
    status: 'ACTIVE',
    rating: '4.9/5',
  },
];

const INITIAL_MATERIALS = [
  {
    id: 'mat-01',
    title: 'National Sample Survey 78th Round - Operational Manual.pdf',
    department: 'MoSPI / National Statistical Office',
    departmentId: 'mospi',
    competency: 'Survey Sampling',
    type: 'PDF Document',
    size: '4.2 MB',
    pages: '64 pages',
    date: '16 Sep 2026',
    author: 'Dr. Rajeshwar Sharma',
    status: 'PROCESSED',
    questionsCount: 15,
    description: 'Detailed operational manual covering household sampling stratification, non-response adjustments, and CV calculation.',
  },
  {
    id: 'mat-02',
    title: 'Guidelines on Consumer Price Index Revision 2026.docx',
    department: 'MoSPI / National Statistical Office',
    departmentId: 'mospi',
    competency: 'Statistical Methods & Price Statistics',
    type: 'DOCX Manual',
    size: '1.8 MB',
    pages: '28 pages',
    date: '14 Sep 2026',
    author: 'Dr. Rajeshwar Sharma',
    status: 'PROCESSED',
    questionsCount: 10,
    description: 'Updated guidelines for rural and urban item basket weightage revisions and geometric mean aggregations.',
  },
  {
    id: 'mat-03',
    title: 'Satellite Remote Sensing & Objective Crop Area Estimation.pdf',
    department: 'Ministry of Agriculture (DES)',
    departmentId: 'agri',
    competency: 'Crop Estimation',
    type: 'PDF Document',
    size: '5.6 MB',
    pages: '52 pages',
    date: '12 Sep 2026',
    author: 'Dr. Sunita Deshmukh',
    status: 'PROCESSED',
    questionsCount: 12,
    description: 'Methodology handbook for multi-spectral remote sensing verification of crop cutting experiments.',
  },
  {
    id: 'mat-04',
    title: 'National Health Accounts & Public Health Surveillance Standards.pdf',
    department: 'Health & Family Welfare (MoHFW)',
    departmentId: 'health',
    competency: 'Health Indicators & Surveillance',
    type: 'PDF Document',
    size: '3.4 MB',
    pages: '38 pages',
    date: '11 Sep 2026',
    author: 'Prof. Amit Varma',
    status: 'PROCESSED',
    questionsCount: 8,
    description: 'Statistical standards for HMIS portal integration and epidemiological risk indicator tracking.',
  },
  {
    id: 'mat-05',
    title: 'Periodic Labour Force Survey (PLFS) Field Sampling Guidelines.pdf',
    department: 'Ministry of Labour & Employment',
    departmentId: 'labour',
    competency: 'Labour Statistics',
    type: 'PDF Document',
    size: '2.9 MB',
    pages: '34 pages',
    date: '08 Sep 2026',
    author: 'Ms. Meenakshi Sundaram',
    status: 'PROCESSED',
    questionsCount: 11,
    description: 'Urban rotational frame sampling and worker population ratio measurement guidelines.',
  },
  {
    id: 'mat-06',
    title: 'UDISE+ Data Quality Verification & Learning Outcomes Index.pdf',
    department: 'Ministry of Education',
    departmentId: 'education',
    competency: 'Education Indicators',
    type: 'PDF Document',
    size: '2.1 MB',
    pages: '24 pages',
    date: '05 Sep 2026',
    author: 'Dr. Rajeshwar Sharma',
    status: 'PROCESSED',
    questionsCount: 9,
    description: 'School level telemetry data auditing and national achievement survey benchmark scoring procedures.',
  },
];

const INITIAL_EMPLOYEES = DEMO_EMPLOYEES.map((emp, index) => ({
  ...emp,
  status: 'ACTIVE',
  email: `officer.${emp.employeeNumber || (index + 1)}@nic.in`,
  diagnosticScore: emp.overallCompetency || 65,
  learningHoursCompleted: 24 + (index * 6),
  lastActive: 'Today',
  assignedTrainer: INITIAL_TRAINERS[index % INITIAL_TRAINERS.length].name,
}));

// LocalStorage Keys
const EMPLOYEES_KEY = 'ks_admin_employees_v2';
const TRAINERS_KEY = 'ks_admin_trainers_v2';
const MATERIALS_KEY = 'ks_trainer_materials_v2';

// ── Employees API ─────────────────────────────────────────────────────────────
export const getStoredEmployees = () => {
  try {
    const data = localStorage.getItem(EMPLOYEES_KEY);
    if (!data) {
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error fetching employees:', e);
    return INITIAL_EMPLOYEES;
  }
};

export const addStoredEmployee = (newEmployee) => {
  const current = getStoredEmployees();
  const created = {
    id: `emp-custom-${Date.now()}`,
    employeeNumber: String(current.length + 1).padStart(2, '0'),
    avatarInitials: newEmployee.name
      ? newEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : 'EM',
    badge: 'GOVERNMENT OFFICER',
    status: 'ACTIVE',
    overallCompetency: Number(newEmployee.overallCompetency) || 60,
    competencyGrowth: '+5% improvement',
    prioritySkillGapsCount: 2,
    criticalGapsCount: 1,
    learningProgressPercent: 15,
    futureRoleReadiness: 45,
    diagnosticScore: Number(newEmployee.overallCompetency) || 60,
    learningHoursCompleted: 6,
    lastActive: 'Just Now',
    joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    assignedTrainer: INITIAL_TRAINERS[0].name,
    competencies: newEmployee.competencies || ['Survey Methods', 'Data Validation', 'Official Statistics'],
    ...newEmployee,
  };
  const updated = [created, ...current];
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
  return created;
};

export const updateStoredEmployee = (id, updates) => {
  const current = getStoredEmployees();
  const updated = current.map(emp => emp.id === id ? { ...emp, ...updates } : emp);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteStoredEmployee = (id) => {
  const current = getStoredEmployees();
  const updated = current.filter(emp => emp.id !== id);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
  return updated;
};

// ── Trainers API ──────────────────────────────────────────────────────────────
export const getStoredTrainers = () => {
  try {
    const data = localStorage.getItem(TRAINERS_KEY);
    if (!data) {
      localStorage.setItem(TRAINERS_KEY, JSON.stringify(INITIAL_TRAINERS));
      return INITIAL_TRAINERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error fetching trainers:', e);
    return INITIAL_TRAINERS;
  }
};

export const addStoredTrainer = (newTrainer) => {
  const current = getStoredTrainers();
  const created = {
    id: `tr-${Date.now()}`,
    trainerId: `TR-FAC-${Math.floor(100 + Math.random() * 900)}`,
    status: 'ACTIVE',
    materialsCount: 0,
    activeBatches: 1,
    rating: '5.0/5',
    ...newTrainer,
  };
  const updated = [created, ...current];
  localStorage.setItem(TRAINERS_KEY, JSON.stringify(updated));
  return created;
};

export const deleteStoredTrainer = (id) => {
  const current = getStoredTrainers();
  const updated = current.filter(tr => tr.id !== id);
  localStorage.setItem(TRAINERS_KEY, JSON.stringify(updated));
  return updated;
};

// ── Department Materials API ──────────────────────────────────────────────────
export const getStoredMaterials = (departmentFilter = 'all') => {
  try {
    const data = localStorage.getItem(MATERIALS_KEY);
    const materials = data ? JSON.parse(data) : INITIAL_MATERIALS;
    if (!data) {
      localStorage.setItem(MATERIALS_KEY, JSON.stringify(INITIAL_MATERIALS));
    }
    if (departmentFilter === 'all' || !departmentFilter) {
      return materials;
    }
    return materials.filter(m => 
      m.departmentId === departmentFilter || 
      m.department.toLowerCase().includes(departmentFilter.toLowerCase())
    );
  } catch (e) {
    console.error('Error fetching materials:', e);
    return INITIAL_MATERIALS;
  }
};

export const addStoredMaterial = (newMaterial) => {
  const current = getStoredMaterials('all');
  const created = {
    id: `mat-${Date.now()}`,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'PROCESSED',
    questionsCount: Math.floor(8 + Math.random() * 8),
    size: '2.4 MB',
    pages: '24 pages',
    author: newMaterial.author || 'Senior Faculty / NSSTA',
    ...newMaterial,
  };
  const updated = [created, ...current];
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(updated));
  return created;
};

export const deleteStoredMaterial = (id) => {
  const current = getStoredMaterials('all');
  const updated = current.filter(m => m.id !== id);
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(updated));
  return updated;
};
