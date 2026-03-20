import Link from 'next/link';

interface AuthFooterProps {
  /** Prefix text before the links (e.g., "By signing in, you agree to our") */
  prefix?: string;
}

/**
 * Reusable footer component for authentication forms.
 * Displays terms of service and privacy policy links.
 */
export function AuthFooter({ prefix = 'By continuing, you agree to our' }: AuthFooterProps) {
  return (
    <p className="text-center text-xs text-muted-foreground">
      {prefix}{' '}
      <Link href="/terms" className="underline-offset-2 transition-colors hover:text-foreground hover:underline">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-foreground hover:underline">
        Privacy Policy
      </Link>
    </p>
  );
}
