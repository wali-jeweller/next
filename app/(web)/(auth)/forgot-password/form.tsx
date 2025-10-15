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

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: Implement forgot password functionality with better-auth
      // const { error } = await authClient.forgetPassword({
      //   email: values.email,
      //   redirectTo: "/reset-password",
      // });

      // For now, just show a success message
      console.log("Password reset requested for:", values.email);
      toast.success("Password reset link sent to your email");
      form.reset();

      // Uncomment when implementing:
      // if (error) {
      //   toast.error(error.message || "An error occurred");
      //   form.setError("root", {
      //     message: error.message || "An error occurred",
      //   });
      // } else {
      //   toast.success("Password reset link sent to your email");
      //   form.reset();
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We&apos;ll send a password reset link to this email address.
              </FormDescription>
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
            ? "Sending reset link..."
            : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}
