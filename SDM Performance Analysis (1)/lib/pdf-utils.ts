import { Employee } from './types';

export function generateEmployeePDF(employee: Employee) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${employee.name} - Evaluation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        h2 { color: #0066cc; margin-top: 20px; font-size: 16px; }
        .info { margin: 20px 0; }
        .info-row { margin: 8px 0; }
        .label { font-weight: bold; }
        .score { color: #0066cc; font-weight: bold; font-size: 18px; }
        .dimension { margin: 15px 0; padding: 10px; border-left: 4px solid #0066cc; }
        .indicator { margin: 8px 0 8px 20px; }
        .timestamp { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        @media print {
          body { margin: 20px; }
          .dimension { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>Laporan Evaluasi Kinerja SDM</h1>
      <div class="info">
        <div class="info-row"><span class="label">Nama:</span> ${employee.name}</div>
        <div class="info-row"><span class="label">Departemen:</span> ${employee.department}</div>
        <div class="info-row"><span class="label">Posisi:</span> ${employee.position}</div>
        <div class="info-row"><span class="label">Tanggal Evaluasi:</span> ${employee.evaluatedAt ? new Date(employee.evaluatedAt).toLocaleDateString('id-ID') : '-'}</div>
      </div>
      
      <h2>Ringkasan Evaluasi</h2>
      <div class="info">
        <div class="info-row"><span class="label">Skor Keseluruhan:</span> <span class="score">${(employee.overallScore || 0).toFixed(2)}</span> / 5.0</div>
        <div class="info-row"><span class="label">Kategori:</span> <span class="score">${employee.category || '-'}</span></div>
      </div>
      
      <h2>Skor Per Dimensi</h2>
      ${employee.dimensions.map((dim) => `
        <div class="dimension">
          <strong>${dim.name}</strong> (Bobot: ${dim.weight}%) - Skor: <span class="score">${(dim.score || 0).toFixed(2)}</span> / 5.0
          ${dim.indicators.map((ind) => `
            <div class="indicator">• ${ind.name}: <strong>${ind.score || 0}</strong></div>
          `).join('')}
        </div>
      `).join('')}
      
      <div class="timestamp">Generated on ${new Date().toLocaleString('id-ID')}</div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}

export function generateDepartmentReportPDF(
  department: string,
  employees: Employee[]
) {
  const filteredEmployees = employees.filter((e) => e.department === department);
  const amanCount = filteredEmployees.filter((e) => e.category === 'Aman').length;
  const perhatianCount = filteredEmployees.filter((e) => e.category === 'Perhatian').length;
  const risikoCount = filteredEmployees.filter((e) => e.category === 'Risiko').length;
  const kritisCount = filteredEmployees.filter((e) => e.category === 'Kritis').length;
  const avgScore =
    filteredEmployees.length > 0
      ? (
          filteredEmployees.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
          filteredEmployees.length
        ).toFixed(2)
      : '0';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Laporan Departemen: ${department}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        .summary { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .summary-row { margin: 8px 0; }
        .label { font-weight: bold; }
        .value { color: #0066cc; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #0066cc; font-weight: bold; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f9f9f9; }
        .timestamp { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>Laporan Departemen: ${department}</h1>
      
      <div class="summary">
        <div class="summary-row"><span class="label">Total Karyawan:</span> <span class="value">${filteredEmployees.length}</span></div>
        <div class="summary-row"><span class="label">Rata-rata Skor:</span> <span class="value">${avgScore}</span> / 5.0</div>
        <div class="summary-row"><span class="label">Aman:</span> <span class="value" style="color: #22c55e;">${amanCount}</span></div>
        <div class="summary-row"><span class="label">Perhatian:</span> <span class="value" style="color: #eab308;">${perhatianCount}</span></div>
        <div class="summary-row"><span class="label">Risiko:</span> <span class="value" style="color: #f97316;">${risikoCount}</span></div>
        <div class="summary-row"><span class="label">Kritis:</span> <span class="value" style="color: #ef4444;">${kritisCount}</span></div>
      </div>
      
      <h2>Daftar Karyawan</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Posisi</th>
            <th>Skor</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          ${filteredEmployees.map((emp, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${emp.name}</td>
              <td>${emp.position}</td>
              <td><strong>${(emp.overallScore || 0).toFixed(2)}</strong></td>
              <td><strong>${emp.category || '-'}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="timestamp">Generated on ${new Date().toLocaleString('id-ID')}</div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=900,height=700');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
