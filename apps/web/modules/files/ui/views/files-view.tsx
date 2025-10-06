"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import { useState } from "react";
import UploadDialog from "../components/upload-dialog";
import DeleteFileDialog from "../components/delete-file-dialog";
import type { PublicFile } from "@workspace/backend/private/files";

const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 },
  );

  const {
    topElementRef,
    handleLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
    canLoadMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };

  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <DeleteFileDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
      <UploadDialog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="ml-auto w-full md:max-w-screen">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">ナレッジベース</h1>
            <p className="text-muted-foreground">
              AIアシスタント用にドキュメントをアップロードし、メタデータを設定します
            </p>
          </div>

          <div className="mt-8 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-5 py-4">
              <Button onClick={() => setUploadDialogOpen(true)}>
                <PlusIcon />
                新規追加
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 font-medium">
                    ファイル名
                  </TableHead>
                  <TableHead className="px-6 py-4 font-medium">
                    タイプ
                  </TableHead>
                  <TableHead className="px-6 py-4 font-medium">
                    サイズ
                  </TableHead>
                  <TableHead className="px-6 py-4 font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          ローディング中...
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={4}>
                          ファイルが見つかりませんでした
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return files.results.map((file) => (
                    <TableRow className="hover:bg-muted/50" key={file.id}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileIcon />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className="uppercase" variant={"outline"}>
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-muted-foreground">
                        {file.size}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              size={"sm"}
                              variant={"ghost"}
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(file)}
                            >
                              <TrashIcon className="size-4 mr-2" />
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t">
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilesView;
