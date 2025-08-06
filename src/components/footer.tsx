const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Link Alchemist. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
