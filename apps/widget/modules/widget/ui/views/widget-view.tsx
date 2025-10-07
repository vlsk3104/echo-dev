"use client";
import React from "react";
import WidgetAuthScreen from "../screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import WidgetErrorScreen from "../screens/widget-error-screen";
import WidgetLoadingScreen from "../screens/widget-loading-screen";
import WidgetSelectionScreen from "../screens/widget-selection-screen";
import WidgetChatScreen from "../screens/widget-chat-screen";
import WidgetInboxScreen from "../screens/widget-inbox-screen";
import WidgetVoiceScreen from "../screens/widget-voice-screen";

interface Props {
  organizationId: string | null;
}

const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);
  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    auth: <WidgetAuthScreen />,
    voice: <WidgetVoiceScreen />,
    inbox: <WidgetInboxScreen />,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>contact</p>,
  };

  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};

export default WidgetView;
