import { Badge } from "@/components/ui/badge";
import type { TProduct } from "@/db/schema";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: TProduct["status"] }) {
  return (
    <Badge variant={"outline"} className="rounded-sm flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "new" && "bg-green-500",
          status === "featured" && "bg-blue-500",
          status === "sale" && "bg-yellow-500",
          status === "trending" && "bg-gray-500",
          status === "coming_soon" && "bg-cyan-500",
          status === "available_on_order" && "bg-orange-500",
          status === "out_of_stock" && "bg-red-500"
        )}
      >
        {" "}
      </span>
      {status}
    </Badge>
  );
}

export const VisibilityBadge = ({
  visibility,
}: {
  visibility: TProduct["visibility"];
}) => {
  return (
    <Badge variant={"outline"} className="rounded-sm flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          visibility === "public" && "bg-green-500",
          visibility === "private" && "bg-red-500"
        )}
      />
      {visibility}
    </Badge>
  );
};
