import { UseFormReturn } from "react-hook-form";
import type { FormSchema } from "./customization-form";
import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/hooks/use-vapi-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
}

export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } =
    useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers();

  const disabled = form.formState.isSubmitting;

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              disabled={assistantsLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "アシスタントを読み込み中..."
                        : "アシスタントを選択してください"
                    }
                  />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                {assistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "名前未設定のアシスタント"}{" "}
                    {assistant.model?.model || "モデル不明"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormDescription>
              音声通話で使用するVapiアシスタントを選択します
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>表示する電話番号</FormLabel>
            <Select
              disabled={phoneNumbersLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? "電話番号を読み込み中..."
                        : "電話番号を選択してください"
                    }
                  />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                {phoneNumbers.map((phone) => (
                  <SelectItem key={phone.id} value={phone.number || phone.id}>
                    {phone.number || "不明"} {phone.name || "名前未設定"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormDescription>
              ウィジェットに表示する電話番号を選択します
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
