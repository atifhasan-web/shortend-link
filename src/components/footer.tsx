import { Facebook, Github, Instagram, Linkedin, MessageSquare } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://www.facebook.com/atifhasan250',
    icon: <Facebook className="h-6 w-6" />,
    name: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/_atif_hasan_/',
    icon: <Instagram className="h-6 w-6" />,
    name: 'Instagram',
  },
  {
    href: 'https://www.linkedin.com/in/atifhasan250/',
    icon: <Linkedin className="h-6 w-6" />,
    name: 'LinkedIn',
  },
  {
    href: 'https://github.com/atifhasan250',
    icon: <Github className="h-6 w-6" />,
    name: 'GitHub',
  },
  {
    href: 'https://wa.me/8801754020488',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.225 4.485 4.635-1.218z" />
      </svg>
    ),
    name: 'WhatsApp',
  },
];

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-center py-6 px-4">
        <div className="mb-4">
          <p className="text-center text-lg font-semibold text-foreground mb-2">
            Connect with me:
          </p>
          <div className="flex items-center justify-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          © 2025 Shortened Link. All rights reserved | Developed by{' '}
          <a
            href="https://atifs-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:underline"
          >
            Atif Hasan
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
