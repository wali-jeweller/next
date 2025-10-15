import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FiltersSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" disabled>
        <Skeleton className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" disabled>
        <Skeleton className="h-4 w-4" />
      </Button>
    </div>
  );
}
