import { ResetPasswordForm } from "./form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-medium">Reset password</h1>
        <p className="text-muted-foreground">Enter your new password below</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
