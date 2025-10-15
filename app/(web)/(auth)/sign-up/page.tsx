import { SignUpForm } from "./form";

export default function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-medium">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your details to create your account
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
