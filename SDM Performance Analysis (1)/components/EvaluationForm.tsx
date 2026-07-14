'use client';

import { useState } from 'react';
import { Employee, Dimension } from '@/lib/types';
import { updateEmployeeScores } from '@/lib/evaluation-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EvaluationFormProps {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export function EvaluationForm({
  employee,
  onSave,
  onCancel,
}: EvaluationFormProps) {
  const [dimensions, setDimensions] = useState<Dimension[]>(
    employee.dimensions
  );

  const handleIndicatorChange = (
    dimIndex: number,
    indIndex: number,
    score: number
  ) => {
    const newDimensions = [...dimensions];
    newDimensions[dimIndex].indicators[indIndex].score = score;
    setDimensions(newDimensions);
  };

  const handleSave = () => {
    const employeeWithUpdatedDimensions = { ...employee, dimensions };
    const employeeWithScores = updateEmployeeScores(employeeWithUpdatedDimensions);
    onSave(employeeWithScores);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
          <p className="text-sm text-muted-foreground">
            {employee.position} • {employee.department}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {dimensions.map((dimension, dimIndex) => (
          <Card key={dimIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {dimension.name}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (Bobot: {dimension.weight}%)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dimension.indicators.map((indicator, indIndex) => (
                <div key={indIndex} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {indicator.name}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {indicator.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={indicator.score}
                      onChange={(e) =>
                        handleIndicatorChange(dimIndex, indIndex, parseFloat(e.target.value))
                      }
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                    />
                    <div className="w-12 text-center">
                      <span className="text-sm font-semibold text-foreground">
                        {indicator.score.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() =>
                          handleIndicatorChange(dimIndex, indIndex, score)
                        }
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          indicator.score === score
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Simpan Evaluasi
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Batal
        </Button>
      </div>
    </div>
  );
}
