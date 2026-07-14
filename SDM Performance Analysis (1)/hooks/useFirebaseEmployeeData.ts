'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, remove, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Employee } from '@/lib/types';

export function useFirebaseEmployeeData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for real-time updates
  useEffect(() => {
    try {
      const employeesRef = ref(database, 'employees');
      const unsubscribe = onValue(
        employeesRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const employeeList = Object.entries(data).map(([id, emp]: [string, any]) => ({
              ...emp,
              id,
            }));
            setEmployees(employeeList);
          } else {
            setEmployees([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  const addEmployee = useCallback(
    async (employee: Omit<Employee, 'id'>) => {
      try {
        const newId = Date.now().toString();
        const employeeRef = ref(database, `employees/${newId}`);
        await set(employeeRef, {
          ...employee,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add employee');
      }
    },
    []
  );

  const updateEmployee = useCallback(
    async (id: string, updates: Partial<Employee>) => {
      try {
        const employeeRef = ref(database, `employees/${id}`);
        await update(employeeRef, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update employee');
      }
    },
    []
  );

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      const employeeRef = ref(database, `employees/${id}`);
      await remove(employeeRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  }, []);

  const clearAllEmployees = useCallback(async () => {
    try {
      const employeesRef = ref(database, 'employees');
      await set(employeesRef, {});
      setEmployees([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear employees');
    }
  }, []);

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    clearAllEmployees,
  };
}
