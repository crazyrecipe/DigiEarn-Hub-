import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function AuthRequired() {
  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-card border border-border text-center shadow-elegant">
      <h2 className="text-2xl font-extrabold mb-2">Login Required</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Yeh page dekhne ke liye pehle login karein.
      </p>
      <div className="flex gap-2 justify-center">
        <Button asChild className="bg-gradient-brand">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
