// SDM Performance Layoff Scheme Types

export interface Indicator {
  name: string;
  description: string;
  score: number; // 1-5
}

export interface Dimension {
  name: string;
  weight: number; // percentage
  indicators: Indicator[];
  score?: number; // calculated
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  dimensions: Dimension[];
  overallScore?: number;
  category?: 'Aman' | 'Perhatian' | 'Risiko' | 'Kritis';
  evaluatedAt?: string;
  history?: EvaluationHistory[];
}

export interface EvaluationHistory {
  evaluatedAt: string;
  overallScore: number;
  category: 'Aman' | 'Perhatian' | 'Risiko' | 'Kritis';
}

export const DIMENSIONS: Omit<Dimension, 'score'>[] = [
  {
    name: 'Performa Kerja',
    weight: 20,
    indicators: [
      {
        name: 'Hasil Kerja',
        description: 'Kualitas dan kuantitas hasil kerja',
        score: 0,
      },
      {
        name: 'Efisiensi',
        description: 'Penggunaan waktu dan sumber daya',
        score: 0,
      },
      {
        name: 'Ketepatan Waktu',
        description: 'Pengiriman hasil tepat waktu',
        score: 0,
      },
    ],
  },
  {
    name: 'Kompetensi',
    weight: 15,
    indicators: [
      {
        name: 'Pengetahuan Teknis',
        description: 'Keahlian dalam bidang pekerjaan',
        score: 0,
      },
      {
        name: 'Kemampuan Analisis',
        description: 'Kemampuan memecahkan masalah',
        score: 0,
      },
      {
        name: 'Pengembangan Diri',
        description: 'Upaya meningkatkan kompetensi',
        score: 0,
      },
    ],
  },
  {
    name: 'Kontribusi Tim',
    weight: 15,
    indicators: [
      {
        name: 'Kolaborasi',
        description: 'Bekerja sama dengan tim',
        score: 0,
      },
      {
        name: 'Komunikasi',
        description: 'Efektivitas komunikasi',
        score: 0,
      },
      {
        name: 'Dukungan Rekan',
        description: 'Membantu anggota tim lain',
        score: 0,
      },
    ],
  },
  {
    name: 'Kedisiplinan',
    weight: 15,
    indicators: [
      {
        name: 'Kehadiran',
        description: 'Tingkat kehadiran dan ketepatan waktu',
        score: 0,
      },
      {
        name: 'Mematuhi Aturan',
        description: 'Kepatuhan terhadap kebijakan',
        score: 0,
      },
      {
        name: 'Tanggung Jawab',
        description: 'Tanggung jawab terhadap tugas',
        score: 0,
      },
    ],
  },
  {
    name: 'Potensi',
    weight: 15,
    indicators: [
      {
        name: 'Kemampuan Kepemimpinan',
        description: 'Potensi kepemimpinan',
        score: 0,
      },
      {
        name: 'Inisiatif',
        description: 'Mengambil inisiatif dalam pekerjaan',
        score: 0,
      },
      {
        name: 'Kemampuan Belajar',
        description: 'Cepat menguasai keterampilan baru',
        score: 0,
      },
    ],
  },
  {
    name: 'Biaya & Nilai',
    weight: 10,
    indicators: [
      {
        name: 'Efisiensi Biaya',
        description: 'Penggunaan biaya yang efisien',
        score: 0,
      },
      {
        name: 'ROI',
        description: 'Return on investment karyawan',
        score: 0,
      },
    ],
  },
  {
    name: 'Senioritas & Loyalitas',
    weight: 10,
    indicators: [
      {
        name: 'Masa Kerja',
        description: 'Masa kerja di perusahaan',
        score: 0,
      },
      {
        name: 'Loyalitas',
        description: 'Kesetiaan terhadap perusahaan',
        score: 0,
      },
    ],
  },
];

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  averageScore: number;
  aman: number;
  perhatian: number;
  risiko: number;
  kritis: number;
}
