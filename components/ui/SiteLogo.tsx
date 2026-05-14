import { Building2 } from 'lucide-react';

const SiteLogo = () => {
  return (
    <div className="mb-12 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
        <Building2 className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <p className="text-xl font-bold tracking-tight text-foreground">Dubai Property IQ</p>
        <p className="mt-1.5 text-muted-foreground">Intelligent Real Estate Analytics</p>
      </div>
    </div>
  );
};

export default SiteLogo;
