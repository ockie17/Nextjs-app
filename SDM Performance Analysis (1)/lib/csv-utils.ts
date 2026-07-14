import { Employee, DIMENSIONS } from './types';
import Papa from 'papaparse';

// Export employees to CSV
export function exportToCSV(employees: Employee[], filename: string = 'sdm-evaluation.csv') {
  const csvData: any[] = [];

  // Header row
  const headers = [
    'ID',
    'Nama',
    'Departemen',
    'Posisi',
    'Skor Keseluruhan',
    'Kategori',
    'Tanggal Evaluasi',
  ];

  // Add dimension and indicator headers
  DIMENSIONS.forEach((dim) => {
    headers.push(`${dim.name} (Skor)`);
    dim.indicators.forEach((ind) => {
      headers.push(`${dim.name} - ${ind.name}`);
    });
  });

  csvData.push(headers);

  // Data rows
  employees.forEach((emp) => {
    const row = [
      emp.id,
      emp.name,
      emp.department,
      emp.position,
      emp.overallScore || 0,
      emp.category || '-',
      emp.evaluatedAt ? new Date(emp.evaluatedAt).toLocaleDateString('id-ID') : '-',
    ];

    // Add dimension scores and indicator scores
    emp.dimensions.forEach((dim) => {
      row.push(dim.score || 0);
      dim.indicators.forEach((ind) => {
        row.push(ind.score || 0);
      });
    });

    csvData.push(row);
  });

  // Create CSV string
  const csv = Papa.unparse(csvData);

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import employees from CSV
export function importFromCSV(file: File): Promise<Partial<Employee>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as any[];
          if (rows.length < 2) {
            reject(new Error('CSV file is empty'));
            return;
          }

          const employees: Partial<Employee>[] = [];
          const headers = rows[0] as string[];

          // Find column indices
          const idIdx = headers.indexOf('ID');
          const nameIdx = headers.indexOf('Nama');
          const deptIdx = headers.indexOf('Departemen');
          const posIdx = headers.indexOf('Posisi');

          if (nameIdx === -1 || deptIdx === -1 || posIdx === -1) {
            reject(
              new Error(
                'CSV must contain columns: Nama, Departemen, Posisi'
              )
            );
            return;
          }

          // Parse employee rows
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i] as string[];
            
            // Only process rows with at least name, department, and position
            if (row[nameIdx] && row[deptIdx] && row[posIdx]) {
              const employee: Partial<Employee> = {
                id: row[idIdx] || Date.now().toString() + i,
                name: row[nameIdx].trim(),
                department: row[deptIdx].trim(),
                position: row[posIdx].trim(),
              };

              employees.push(employee);
            }
          }

          if (employees.length === 0) {
            reject(new Error('No valid employee records found in CSV'));
            return;
          }

          resolve(employees);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Simple CSV for import (minimal columns)
export function exportSimpleCSV(employees: Employee[]) {
  const headers = ['Nama', 'Departemen', 'Posisi'];
  const rows = employees.map((emp) => [emp.name, emp.department, emp.position]);

  const csvData = [headers, ...rows];
  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'sdm-template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
