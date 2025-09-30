import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Loader } from "lucide-react";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "さらに読み込む",
  noMoreText = "",
  className,
  ref,
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText as string | React.ReactElement;

  if (isLoadingMore) {
    text = <Loader className="animate-spin" />;
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn("flex w-full justify-center", className)} ref={ref}>
      <Button
        disabled={!canLoadMore && !isLoadingMore}
        onClick={onLoadMore}
        size={"sm"}
        variant={"ghost"}
      >
        {text}
      </Button>
    </div>
  );
};

export default InfiniteScrollTrigger;
