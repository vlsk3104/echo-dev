import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

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
  noMoreText = "これ以上読み込むものはありません",
  className,
  ref,
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "ローディング中...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn("flex w-full justify-center", className)} ref={ref}>
      <Button
        disabled={!canLoadMore || !isLoadingMore}
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
