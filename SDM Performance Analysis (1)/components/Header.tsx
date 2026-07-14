import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              SDM Analytics
            </h1>
            <p className="text-xs text-muted-foreground">Performance Evaluation System</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/40">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live • Firebase Connected</span>
        </div>
      </div>
    </header>
  );
}
