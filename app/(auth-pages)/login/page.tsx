import { signInAction } from "@/lib/action/auth";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
     <div className="min-h-screen flex items-center justify-center">
      <form className="flex flex-col min-w-64 w-full max-w-sm bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-medium mb-5">Sign in</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 ">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      </div>
  );
}
