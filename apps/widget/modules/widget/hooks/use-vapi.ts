import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

const VAPI_PUBLIC_KEY = "396297f0-c854-4d34-84b1-5f82325c4b4b";
const VAPI_ASSISTANT_ID = "f8e97720-0148-47fa-81f4-2d783ca7efd5";

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("Vapi: NEXT_PUBLIC_VAPI_PUBLIC_KEY が設定されていません");
      return;
    }
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnecting(true);
      setIsConnected(false);
      setTranscript([]);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
      console.log("Vapi error:", error);
      setIsConnected(false);
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = () => {
    setIsConnecting(true);
    if (!vapi) return;
    if (!VAPI_ASSISTANT_ID) {
      console.error("Vapi: NEXT_PUBLIC_VAPI_ASSISTANT_ID が設定されていません");
      setIsConnecting(false);
      return;
    }
    vapi.start(VAPI_ASSISTANT_ID);
  };

  const endCall = () => {
    vapi?.stop();
  };

  return {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  };
};
