'use client';

import { Employee } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Trash2, Edit, MoreVertical } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
  filteredEmployees?: Employee[];
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'Aman':
      return 'bg-green-100 text-green-800';
    case 'Perhatian':
      return 'bg-yellow-100 text-yellow-800';
    case 'Risiko':
      return 'bg-orange-100 text-orange-800';
    case 'Kritis':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function EmployeeList({
  employees,
  onEdit,
  onDelete,
  filteredEmployees,
}: EmployeeListProps) {
  const displayEmployees = filteredEmployees || employees;

  if (displayEmployees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Belum ada data karyawan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayEmployees.map((employee) => (
        <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {employee.name}
                  </h3>
                  {employee.category && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getCategoryColor(employee.category)}`}
                    >
                      {employee.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {employee.position} • {employee.department}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-foreground">
                    Skor: {(employee.overallScore || 0).toFixed(2)} / 5.0
                  </span>
                  {employee.evaluatedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(employee.evaluatedAt).toLocaleDateString('id-ID')}
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(employee)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Evaluasi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const { generateEmployeePDF } = require('@/lib/pdf-utils');
                      generateEmployeePDF(employee);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Cetak / Simpan PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(employee.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
