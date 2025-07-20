import { useEffect, useRef, useState } from "react";

export default function useSessionTimeout({
  timeout = 30000,
  warningTime = 10000,
  onExtend,
  onLogout,
  enabled = true,
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const timeoutIdRef = useRef(null);
  const warningIdRef = useRef(null);
  const isPromptVisibleRef = useRef(false); // 🛠️ fix modal auto-close

  const resetTimer = () => {
    if (!enabled || isPromptVisibleRef.current) return; // ⛔ do not reset if prompt is open

    clearTimeout(timeoutIdRef.current);
    clearTimeout(warningIdRef.current);

    warningIdRef.current = setTimeout(() => {
      isPromptVisibleRef.current = true;
      setShowPrompt(true);
    }, timeout - warningTime);

    timeoutIdRef.current = setTimeout(() => {
      setShowPrompt(false);
      onLogout();
    }, timeout);
  };

  useEffect(() => {
    if (!enabled) return;
    const handleActivity = () => {
      if (!isPromptVisibleRef.current) {
        resetTimer();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetTimer();

    return () => {
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningIdRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [enabled]);

  const handleExtend = async () => {
    setShowPrompt(false);
    isPromptVisibleRef.current = false;
    await onExtend();
    resetTimer();
  };

  return { showPrompt, extendSession: handleExtend };
}
