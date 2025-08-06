import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import Logo from './logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-base font-semibold text-primary">
            Link Alchemist
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
