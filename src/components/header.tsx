import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import Logo from './logo';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold text-primary">
            Link Alchemist
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
