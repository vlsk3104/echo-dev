"use client";
import React from "react";
import WidgetAuthScreen from "../screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";

interface Props {
  organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);
  const screenComponents = {
    error: <p>error</p>,
    loading: <p>loading</p>,
    auth: <WidgetAuthScreen />,
    voice: <p>voice</p>,
    inbox: <p>inbox</p>,
    selection: <p>selection</p>,
    chat: <p>chat</p>,
    contact: <p>contact</p>,
  };

  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};

export default WidgetView;
