"use client";
import { GlobeIcon, PhoneCallIcon, PhoneIcon } from "lucide-react";
import PluginCard, { Feature } from "../components/plugin-card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";

const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web音声通話",
    description: "アプリ内で直接ボイスチャットが可能",
  },
  {
    icon: PhoneIcon,
    label: "電話番号",
    description: "専用のビジネス回線を取得",
  },
  {
    icon: PhoneCallIcon,
    label: "発信通話",
    description: "顧客への自動アウトリーチ（自動発信）",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, { message: "公開APIキーは必須です" }),
  privateApiKey: z.string().min(1, { message: "非公開APIキーは必須です" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privateApiKey: "",
      publicApiKey: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const { publicApiKey, privateApiKey } = data;

    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey,
          privateApiKey,
        },
      });

      setOpen(false);
      toast.success("Vapiシークレットが作成されました");
    } catch (err) {
      console.error(err);
      toast.error("問題が発生しました。");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vapi を有効化</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          あなたの APIキーは安全に暗号化され、AWS Secrets Manager
          に保存されます。
        </DialogDescription>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>公開APIキー</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="あなたの公開APIキー"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>非公開APIキー</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="あなたの非公開APIキー"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "接続中..." : "接続"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleSubmit = () => {
    vapiPlugin ? setRemoveOpen(true) : setConnectOpen(true);
  };

  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi プラグイン</h1>
            <p className="text-muted-foreground">
              Vapi を接続して、AI 音声通話と電話サポートを有効にしましょう。
            </p>
          </div>

          <div className="mt-8">
            {vapiPlugin ? (
              <p>connected</p>
            ) : (
              <PluginCard
                serviceImage="/vapi.jpg"
                serviceName="vapi"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VapiView;
