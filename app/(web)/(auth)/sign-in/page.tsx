import { SignInForm } from "./form";

export default async function Page() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-medium">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <SignInForm />
      <div className="space-y-2 text-center text-sm text-muted-foreground">
        <p>
          <a
            href="/forgot-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Forgot your password?
          </a>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
