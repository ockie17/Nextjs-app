import { useEffect, useState, useCallback } from 'react';
import { Employee } from '@/lib/types';
import { updateEmployeeScores } from '@/lib/evaluation-utils';

const STORAGE_KEY = 'sdm_employees';

export function useEmployeeData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEmployees(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load employees from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      } catch (error) {
        console.error('Failed to save employees to localStorage:', error);
      }
    }
  }, [employees, isLoading]);

  const addEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  }, []);

  const updateEmployee = useCallback((employeeId: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? updateEmployeeScores({ ...emp, ...updates })
          : emp
      )
    );
  }, []);

  const deleteEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  }, []);

  const deleteAllEmployees = useCallback(() => {
    setEmployees([]);
  }, []);

  const updateDimensionIndicator = useCallback(
    (employeeId: string, dimensionIndex: number, indicatorIndex: number, score: number) => {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === employeeId) {
            const updated = { ...emp };
            if (updated.dimensions[dimensionIndex] && 
                updated.dimensions[dimensionIndex].indicators[indicatorIndex]) {
              updated.dimensions[dimensionIndex].indicators[indicatorIndex].score = score;
              return updateEmployeeScores(updated);
            }
          }
          return emp;
        })
      );
    },
    []
  );

  return {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    deleteAllEmployees,
    updateDimensionIndicator,
  };
}
