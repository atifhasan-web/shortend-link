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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createShortLink, updateLink } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Copy, Link as LinkIcon, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  slug: z.string().min(3, { message: 'Custom name must be at least 3 characters.' }).regex(/^[a-zA-Z0-9_-]+$/, { message: 'Only letters, numbers, hyphens, and underscores are allowed.' }),
});

const updateFormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

const adminAuthSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function Home() {
  const [generatedLink, setGeneratedLink] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [slugToManage, setSlugToManage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [origin, setOrigin] = useState('');
  const { toast } = useToast();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');


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

  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      url: '',
    },
  });

  const adminAuthForm = useForm<z.infer<typeof adminAuthSchema>>({
    resolver: zodResolver(adminAuthSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });


  function showSuccessModal(shortUrl: string) {
    setGeneratedLink(`${origin}/${shortUrl}`);
    setIsModalOpen(true);
    form.reset();
  }
  
  function openManageModal(slug: string) {
    setSlugToManage(slug);
    setIsAdminAuthenticated(false);
    setAuthError('');
    adminAuthForm.reset();
    updateForm.reset({ url: '' });
    setIsManageModalOpen(true);
  }

  async function onAdminAuthSubmit(values: z.infer<typeof adminAuthSchema>) {
    // Hardcoded credentials for simplicity
    if (values.username === 'fahim' && values.password === 'fahim') {
      setIsAdminAuthenticated(true);
      setAuthError('');
      // Explicitly reset the update form here to ensure it's clean for the next step
      updateForm.reset({ url: '' });
    } else {
      setAuthError('Invalid credentials. Only admins can manage links.');
      setIsAdminAuthenticated(false);
    }
  }

  async function onUpdateSubmit(values: z.infer<typeof updateFormSchema>) {
    if (!isAdminAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be authenticated to update a link.',
      });
      return;
    }
    setIsUpdating(true);
    try {
      const result = await updateLink(slugToManage, values.url);
      if (result.success && result.shortUrl) {
        setIsManageModalOpen(false);
        showSuccessModal(result.shortUrl);
        toast({
          title: 'Success!',
          description: 'The link has been updated successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to update link.',
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsUpdating(false);
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createShortLink(values);
      if (result.success && result.shortUrl) {
        showSuccessModal(result.shortUrl);
      } else {
        if (result.error === 'This custom name is already taken.') {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: (
              <div>
                <p>{result.error}</p>
                <button
                  onClick={() => openManageModal(values.slug)}
                  className="mt-2 text-sm underline text-white hover:text-gray-200"
                >
                  Manage this link instead?
                </button>
              </div>
            ),
          });
        } else if (result.error === 'This URL has already been shortened.' && result.shortUrl) {
           toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => showSuccessModal(result.shortUrl!)}
                className="bg-white text-black hover:bg-gray-100 hover:text-black"
              >
                See Link
              </Button>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'Failed to create link.',
          });
        }
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
                    <FormDescription className="bg-muted p-2 rounded-md break-words">
                      Your shortened link will look like this: {origin}/&lt;your-custom-name&gt;
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="my-magic-link" {...field} className="mt-4" />
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

      {/* Success Modal */}
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
      
      {/* Manage Name Modal */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-center">Update Link</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-center text-muted-foreground">
              The custom name <span className="font-bold text-primary">{slugToManage}</span> is already taken. You can update the long URL it points to.
            </p>

            {!isAdminAuthenticated ? (
              <Form {...adminAuthForm}>
                 {authError && (
                    <Alert variant="destructive">
                      <AlertTitle>Authentication Failed</AlertTitle>
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}
                <form onSubmit={adminAuthForm.handleSubmit(onAdminAuthSubmit)} className="space-y-4">
                  <FormField
                    control={adminAuthForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={adminAuthForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter admin password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Authenticate
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                  <FormField
                    control={updateForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Long URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-new-long-url.com/goes-here" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update and Save Link'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
