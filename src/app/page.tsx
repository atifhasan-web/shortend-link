'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createShortLink } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Copy, Link as LinkIcon, Wand2 } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  slug: z.string().min(3, { message: 'Custom name must be at least 3 characters.' }).regex(/^[a-zA-Z0-9_-]+$/, { message: 'Only letters, numbers, hyphens, and underscores are allowed.' }),
});

export default function Home() {
  const [generatedLink, setGeneratedLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [origin, setOrigin] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      slug: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createShortLink(values);
      if (result.success && result.shortUrl) {
        setGeneratedLink(`${origin}/${result.shortUrl}`);
        setIsModalOpen(true);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to create link.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Copied to clipboard!',
      description: 'The short link has been copied.',
    });
  };
  
  const displayOrigin = origin ? origin.replace(/^(https?:\/\/)/, '') : '';

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
       <div className="flex flex-col items-center justify-center text-center px-4 mb-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Shortened Link
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
          Transform your long, unwieldy URLs into short, memorable links. Create your magic link and share it with the world.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Create a Magical Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-very-long-url.com/goes-here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1">
                        <span className="text-muted-foreground pl-3 pr-2 py-2 text-sm bg-muted rounded-l-md border-r border-input">{displayOrigin}/</span>
                        <Input placeholder="my-magic-link" className="border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-headline" disabled={isSubmitting}>
                {isSubmitting ? 'Conjuring...' : 'Generate Link'}
                <Wand2 className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-center">Your Link is Ready!</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-center text-muted-foreground">
              Your alchemy was successful. Here is your short link:
            </p>
            <div className="flex items-center space-x-2">
                <Input value={generatedLink} readOnly />
                <Button type="button" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <Button asChild variant="outline">
              <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                Test Link <LinkIcon className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
