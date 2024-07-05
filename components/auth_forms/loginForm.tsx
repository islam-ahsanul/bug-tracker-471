// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useToast } from '@/components/ui/use-toast';

// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { loginWithCredentials } from '@/server-actions/authServerAction';

// const formSchema = z.object({
//   email: z.string().email({ message: 'Email is invalid' }),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters long' }),
// });

// const LoginForm = () => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('email', values.email);
//       formData.append('password', values.password);

//       const result = await loginWithCredentials(formData);

//       if (result?.error) {
//         toast({
//           title: 'Login failed',
//           description: result.error,
//           variant: 'destructive',
//         });
//       } else {
//         toast({
//           title: 'Login successful',
//         });
//         router.push('/');
//       }
//     } catch (error: any) {
//       toast({
//         title: 'An unexpected error occurred',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email Address</FormLabel>
//               <FormControl>
//                 <Input type="email" placeholder="Enter your email" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type="password"
//                   placeholder="Enter your password"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? 'Logging in...' : 'Log In'}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default LoginForm;
