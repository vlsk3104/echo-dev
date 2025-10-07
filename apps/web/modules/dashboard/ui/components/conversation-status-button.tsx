"use client";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="未解決にする">
        <Button
          disabled={disabled}
          onClick={onClick}
          size={"sm"}
          variant={"tertiary"}
        >
          <CheckIcon />
          解決済み
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="解決済みにする">
        <Button
          disabled={disabled}
          onClick={onClick}
          size={"sm"}
          variant={"warning"}
        >
          <CheckIcon />
          エスカレーション済み
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="エスカレーション済みに変更する">
      <Button
        disabled={disabled}
        onClick={onClick}
        size={"sm"}
        variant={"destructive"}
      >
        <ArrowRightIcon />
        未解決
      </Button>
    </Hint>
  );
};

export default ConversationStatusButton;
