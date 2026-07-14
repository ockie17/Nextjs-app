import {
  Employee,
  Dimension,
  DepartmentStats,
  DIMENSIONS,
  EvaluationHistory,
} from './types';

// Calculate dimension score from indicators
export function calculateDimensionScore(dimension: Dimension): number {
  if (dimension.indicators.length === 0) return 0;
  const sum = dimension.indicators.reduce((acc, ind) => acc + ind.score, 0);
  return Math.round((sum / dimension.indicators.length) * 10) / 10;
}

// Calculate overall score using weighted dimensions
export function calculateOverallScore(dimensions: Dimension[]): number {
  let totalWeight = 0;
  let weightedSum = 0;

  dimensions.forEach((dim) => {
    const score = calculateDimensionScore(dim);
    weightedSum += score * dim.weight;
    totalWeight += dim.weight;
  });

  return totalWeight === 0 ? 0 : Math.round((weightedSum / totalWeight) * 10) / 10;
}

// Categorize employee based on score
export function categorizeEmployee(
  score: number
): 'Aman' | 'Perhatian' | 'Risiko' | 'Kritis' {
  if (score >= 4.0) return 'Aman';
  if (score >= 3.0) return 'Perhatian';
  if (score >= 2.0) return 'Risiko';
  return 'Kritis';
}

// Create new employee
export function createEmployee(
  name: string,
  department: string,
  position: string
): Employee {
  const dimensions: Dimension[] = DIMENSIONS.map((dim) => ({
    ...dim,
    indicators: dim.indicators.map((ind) => ({ ...ind })),
  }));

  return {
    id: Date.now().toString(),
    name,
    department,
    position,
    dimensions,
    evaluatedAt: new Date().toISOString(),
    history: [],
  };
}

// Calculate and update employee scores
export function updateEmployeeScores(employee: Employee): Employee {
  const dimensionsWithScores = employee.dimensions.map((dim) => ({
    ...dim,
    score: calculateDimensionScore(dim),
  }));

  const overallScore = calculateOverallScore(dimensionsWithScores);
  const category = categorizeEmployee(overallScore);

  // Add to history if score changed
  const updatedEmployee: Employee = {
    ...employee,
    dimensions: dimensionsWithScores,
    overallScore,
    category,
    evaluatedAt: new Date().toISOString(),
  };

  if (
    !employee.history ||
    employee.history.length === 0 ||
    employee.history[employee.history.length - 1].overallScore !== overallScore
  ) {
    updatedEmployee.history = [
      ...(employee.history || []),
      {
        evaluatedAt: new Date().toISOString(),
        overallScore,
        category,
      },
    ];
  }

  return updatedEmployee;
}

// Get department statistics
export function getDepartmentStats(employees: Employee[]): DepartmentStats[] {
  const departmentMap = new Map<string, Employee[]>();

  employees.forEach((emp) => {
    if (!departmentMap.has(emp.department)) {
      departmentMap.set(emp.department, []);
    }
    departmentMap.get(emp.department)!.push(emp);
  });

  return Array.from(departmentMap.entries()).map(([dept, emps]) => {
    const aman = emps.filter((e) => e.category === 'Aman').length;
    const perhatian = emps.filter((e) => e.category === 'Perhatian').length;
    const risiko = emps.filter((e) => e.category === 'Risiko').length;
    const kritis = emps.filter((e) => e.category === 'Kritis').length;
    const averageScore =
      emps.length > 0
        ? Math.round(
            (emps.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
              emps.length) *
              10
          ) / 10
        : 0;

    return {
      department: dept,
      employeeCount: emps.length,
      averageScore,
      aman,
      perhatian,
      risiko,
      kritis,
    };
  });
}

// Filter employees by department
export function filterByDepartment(
  employees: Employee[],
  department: string
): Employee[] {
  if (department === 'all') return employees;
  return employees.filter((e) => e.department === department);
}

// Sort employees
export function sortEmployees(
  employees: Employee[],
  sortBy: 'name' | 'score' | 'category' | 'department' = 'name'
): Employee[] {
  const sorted = [...employees];

  switch (sortBy) {
    case 'score':
      sorted.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
      break;
    case 'category': {
      const categoryOrder = { Kritis: 0, Risiko: 1, Perhatian: 2, Aman: 3 };
      sorted.sort(
        (a, b) =>
          categoryOrder[a.category as keyof typeof categoryOrder] -
          categoryOrder[b.category as keyof typeof categoryOrder]
      );
      break;
    }
    case 'department':
      sorted.sort((a, b) => a.department.localeCompare(b.department));
      break;
    case 'name':
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

// Get unique departments
export function getUniqueDepartments(employees: Employee[]): string[] {
  return Array.from(new Set(employees.map((e) => e.department))).sort();
}

// Get statistics summary
export function getStatisticsSummary(employees: Employee[]) {
  if (employees.length === 0) {
    return {
      total: 0,
      aman: 0,
      perhatian: 0,
      risiko: 0,
      kritis: 0,
      averageScore: 0,
    };
  }

  return {
    total: employees.length,
    aman: employees.filter((e) => e.category === 'Aman').length,
    perhatian: employees.filter((e) => e.category === 'Perhatian').length,
    risiko: employees.filter((e) => e.category === 'Risiko').length,
    kritis: employees.filter((e) => e.category === 'Kritis').length,
    averageScore:
      Math.round(
        (employees.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
          employees.length) *
          10
      ) / 10,
  };
}
