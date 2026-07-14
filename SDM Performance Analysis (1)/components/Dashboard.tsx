'use client';

import { Employee } from '@/lib/types';
import { getStatisticsSummary, getDepartmentStats } from '@/lib/evaluation-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  employees: Employee[];
}

const COLORS = {
  Aman: '#22c55e',
  Perhatian: '#eab308',
  Risiko: '#f97316',
  Kritis: '#ef4444',
};

export function Dashboard({ employees }: DashboardProps) {
  const stats = getStatisticsSummary(employees);
  const deptStats = getDepartmentStats(employees);

  const categoryData = [
    { name: 'Aman', value: stats.aman, fill: COLORS.Aman },
    { name: 'Perhatian', value: stats.perhatian, fill: COLORS.Perhatian },
    { name: 'Risiko', value: stats.risiko, fill: COLORS.Risiko },
    { name: 'Kritis', value: stats.kritis, fill: COLORS.Kritis },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Karyawan</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Aman</p>
              <p className="text-3xl font-bold text-green-600">{stats.aman}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? ((stats.aman / stats.total) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Perhatian</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.perhatian}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? ((stats.perhatian / stats.total) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Risiko</p>
              <p className="text-3xl font-bold text-orange-600">{stats.risiko}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? ((stats.risiko / stats.total) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Kritis</p>
              <p className="text-3xl font-bold text-red-600">{stats.kritis}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? ((stats.kritis / stats.total) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Rata-rata Skor per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={deptStats}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="department"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Stats Table */}
      {deptStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistik Per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold text-foreground">
                      Departemen
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Jumlah
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Rata-rata Skor
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Aman
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Perhatian
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Risiko
                    </th>
                    <th className="px-4 py-2 font-semibold text-foreground text-right">
                      Kritis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map((dept) => (
                    <tr key={dept.department} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2 text-foreground">
                        {dept.department}
                      </td>
                      <td className="px-4 py-2 text-right text-foreground">
                        {dept.employeeCount}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-foreground">
                        {dept.averageScore.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-green-600">
                        {dept.aman}
                      </td>
                      <td className="px-4 py-2 text-right text-yellow-600">
                        {dept.perhatian}
                      </td>
                      <td className="px-4 py-2 text-right text-orange-600">
                        {dept.risiko}
                      </td>
                      <td className="px-4 py-2 text-right text-red-600">
                        {dept.kritis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
