'use client';

import { useState, useRef } from 'react';
import { useFirebaseEmployeeData } from '@/hooks/useFirebaseEmployeeData';
import { createEmployee } from '@/lib/evaluation-utils';
import { sortEmployees, filterByDepartment, getUniqueDepartments } from '@/lib/evaluation-utils';
import { exportToCSV, exportSimpleCSV, importFromCSV } from '@/lib/csv-utils';
import { Employee } from '@/lib/types';
import { Dashboard } from '@/components/Dashboard';
import { EmployeeList } from '@/components/EmployeeList';
import { EvaluationForm } from '@/components/EvaluationForm';
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Plus, Download, Upload, FileText, Trash2, ChevronDown } from 'lucide-react';

export default function Home() {
  const {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    clearAllEmployees,
  } = useFirebaseEmployeeData();

  const isLoading = loading;

  const [view, setView] = useState<'dashboard' | 'employees' | 'evaluate'>('dashboard');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeDept, setNewEmployeeDept] = useState('');
  const [newEmployeePos, setNewEmployeePos] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'category' | 'department'>('name');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const departments = getUniqueDepartments(employees);
  let filteredEmployees = filterByDepartment(employees, selectedDepartment);
  filteredEmployees = sortEmployees(filteredEmployees, sortBy);

  const handleAddEmployee = () => {
    if (!newEmployeeName.trim() || !newEmployeeDept.trim() || !newEmployeePos.trim()) {
      alert('Mohon isi semua field');
      return;
    }

    const newEmployee = createEmployee(
      newEmployeeName,
      newEmployeeDept,
      newEmployeePos
    );

    addEmployee(newEmployee);
    setNewEmployeeName('');
    setNewEmployeeDept('');
    setNewEmployeePos('');
  };

  const handleEvaluate = (employee: Employee) => {
    setEditingEmployee(employee);
    setView('evaluate');
  };

  const handleSaveEvaluation = (employee: Employee) => {
    updateEmployee(employee.id, employee);
    setEditingEmployee(null);
    setView('employees');
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importFromCSV(file);
      
      importedData.forEach((data) => {
        const employee = createEmployee(
          data.name || 'Unnamed',
          data.department || 'Unknown',
          data.position || 'Unknown'
        );
        addEmployee(employee);
      });

      alert(`${importedData.length} karyawan berhasil diimpor`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Import gagal'}`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <TabNavigation activeTab={view} onTabChange={setView} />
          <div className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/30 border border-border/40">
            {employees.length} karyawan
          </div>
        </div>

        {view === 'employees' && employees.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToCSV(employees)}>
                  Export Semua (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportSimpleCSV(employees)}>
                  Template Import (CSV)
                </DropdownMenuItem>
                {selectedDepartment !== 'all' && (
                  <DropdownMenuItem
                    onClick={() => {
                      const { generateDepartmentReportPDF } = require('@/lib/pdf-utils');
                      generateDepartmentReportPDF(selectedDepartment, employees);
                    }}
                  >
                    Laporan Departemen (Cetak)
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />

            {employees.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Hapus semua data? Ini tidak dapat dibatalkan.')) {
                    clearAllEmployees();
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Semua
              </Button>
            )}
          </div>
        )}

        {/* Dashboard View */}
        {view === 'dashboard' && <Dashboard employees={employees} />}

        {view === 'employees' && (
          <div className="space-y-6">
            {/* Add New Employee */}
            <Card className="border border-primary/30 bg-gradient-to-br from-card to-card/50 shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  <Plus className="h-5 w-5 text-primary" />
                  Tambah Karyawan Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Nama"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                  />
                  <Input
                    placeholder="Departemen"
                    value={newEmployeeDept}
                    onChange={(e) => setNewEmployeeDept(e.target.value)}
                  />
                  <Input
                    placeholder="Posisi"
                    value={newEmployeePos}
                    onChange={(e) => setNewEmployeePos(e.target.value)}
                  />
                  <Button onClick={handleAddEmployee} className="w-full">
                    Tambah
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filters & Sorting */}
            {employees.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Filter Departemen
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="all">Semua Departemen</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Urutkan Berdasarkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'name' | 'score' | 'category' | 'department')
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="name">Nama</option>
                    <option value="score">Skor (Tertinggi)</option>
                    <option value="category">Kategori</option>
                    <option value="department">Departemen</option>
                  </select>
                </div>
              </div>
            )}

            {/* Employee List */}
            <EmployeeList
              employees={employees}
              filteredEmployees={filteredEmployees}
              onEdit={handleEvaluate}
              onDelete={deleteEmployee}
            />
          </div>
        )}

        {view === 'evaluate' && editingEmployee && (
          <Card>
            <CardContent className="pt-6">
              <EvaluationForm
                employee={editingEmployee}
                onSave={handleSaveEvaluation}
                onCancel={() => {
                  setEditingEmployee(null);
                  setView('employees');
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
