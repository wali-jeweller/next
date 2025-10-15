"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: Implement reset password functionality with better-auth
      // Get token from URL params
      // const searchParams = new URLSearchParams(window.location.search);
      // const token = searchParams.get('token');

      // const { error } = await authClient.resetPassword({
      //   newPassword: values.password,
      //   token: token || '',
      // });

      // For now, just show a success message
      console.log("Password reset to:", values.password);
      toast.success("Password reset successfully");
      form.reset();

      // Uncomment when implementing:
      // if (error) {
      //   toast.error(error.message || "An error occurred");
      //   form.setError("root", {
      //     message: error.message || "An error occurred",
      //   });
      // } else {
      //   toast.success("Password reset successfully");
      //   // Redirect to sign in page
      //   window.location.href = '/sign-in';
      // }
    } catch {
      toast.error("An unexpected error occurred");
      form.setError("root", {
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Resetting password..."
            : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
