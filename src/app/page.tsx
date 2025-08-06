import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Wand2 } from 'lucide-react';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <div className="mb-6">
        <Logo className="h-24 w-24 text-primary" />
      </div>
      <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-primary">
        Link Alchemist
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
        Transform your long, unwieldy URLs into short, memorable links. Create your magic link and share it with the world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="font-headline">
          <Link href="/shorten">
            Get Started
            <Wand2 className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
