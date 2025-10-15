import { ForgotPasswordForm } from "./form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-medium">Forgot password?</h1>
        <p className="text-muted-foreground">
          Enter your email address and we&apos;ll send you a reset link
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <a
          href="/sign-in"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
