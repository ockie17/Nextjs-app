'use client';

import { BarChart3, Users, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  activeTab: 'dashboard' | 'employees' | 'evaluate';
  onTabChange: (tab: 'dashboard' | 'employees' | 'evaluate') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'employees', label: 'Karyawan', icon: Users },
    { id: 'evaluate', label: 'Evaluasi', icon: FileCheck },
  ] as const;

  return (
    <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border border-border/40 w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300',
              isActive
                ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
