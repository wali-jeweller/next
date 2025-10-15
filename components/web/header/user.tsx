import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";

export function HeaderUser() {
  return (
    <Button variant="ghost" size="icon">
      <User2 className="size-[18px] stroke-[1.5]" />
    </Button>
  );
}
