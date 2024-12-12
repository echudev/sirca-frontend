import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-center w-fit h-fit">
      <div className="animate-spin">
        <Loader2 className="text-accent" size={28} />
      </div>
    </div>
  );
}
