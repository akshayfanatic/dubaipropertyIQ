import { LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/auth/actions';

const AgentPage = () => {
  return (
    <main className="min-h-screen flex-1 bg-background p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Agent Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">You are signed in as an agent.</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </main>
  );
};

export default AgentPage;
