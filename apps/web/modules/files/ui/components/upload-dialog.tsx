"use client";
import { useAction } from "convex/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload?: () => void;
}

const UploadDialog = ({
  open,
  onOpenChange,
  onFileUpload,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile);

  const [uploadFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ category: "", filename: "" });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      setUploadedFiles([file]);
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({ ...prev, filename: file.name }));
      }
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const blob = uploadFiles[0];

      if (!blob) {
        return;
      }

      const filename = uploadForm.filename || blob.name;
      await addFile({
        bytes: await blob.arrayBuffer(),
        filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      });

      onFileUpload?.();
      handleCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadedFiles([]);
    setUploadForm({
      category: "",
      filename: "",
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>アップロード</DialogTitle>
          <DialogDescription>
            AIアシスタントによる検索と情報取得のために、ナレッジベースへドキュメントをアップロードしてください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリー</Label>
            <Input
              className="w-full"
              id="category"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="例：ドキュメント、サポート、製品"
              type="text"
              value={uploadForm.category}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">ファイル名{"  "}</Label>
            <span className="text-muted-foreground text-xs">（任意）</span>
            <Input
              className="w-full"
              id="filename"
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  filename: e.target.value,
                }))
              }
              placeholder="デフォルトのファイル名を上書きする"
              type="text"
              value={uploadForm.filename}
            />
          </div>

          <Dropzone
            accept={{
              "application/pdf": [".pdf"],
              "text/csv": [".csv"],
              "text/plain": [".text"],
            }}
            disabled={isUploading}
            maxFiles={1}
            onDrop={handleFileDrop}
            src={uploadFiles}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <DialogFooter>
          <Button
            disabled={isUploading}
            onClick={handleCancel}
            variant={"outline"}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              uploadFiles.length === 0 || isUploading || !uploadForm.category
            }
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
