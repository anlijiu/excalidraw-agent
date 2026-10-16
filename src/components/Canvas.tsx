import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { AppState } from "@excalidraw/excalidraw/types";
import { useRef, useCallback } from "react";

interface CanvasProps {
  // Called with the live API once the editor mounts, and with null right
  // before it unmounts (Excalidraw 0.18 contract for onExcalidrawAPI).
  onApiReady?: (api: ExcalidrawImperativeAPI | null) => void;
  onThemeChange?: (theme: "light" | "dark") => void;
}

export default function Canvas({ onApiReady, onThemeChange }: CanvasProps) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const lastTheme = useRef<string>("light");

  const handleMount = useCallback(
    (api: ExcalidrawImperativeAPI | null) => {
      apiRef.current = api;
      onApiReady?.(api);
    },
    [onApiReady]
  );

  const handleChange = useCallback(
    (_elements: readonly any[], appState: AppState) => {
      if (appState.theme !== lastTheme.current) {
        lastTheme.current = appState.theme;
        onThemeChange?.(appState.theme as "light" | "dark");
      }
    },
    [onThemeChange]
  );

  return (
    <div className="canvas-wrapper">
      <Excalidraw
        // Excalidraw 0.18 renamed the `excalidrawAPI` prop to
        // `onExcalidrawAPI` (and calls it with null on unmount). Passing the
        // old name is silently ignored, which leaves the app with no handle
        // on the scene — queryCanvas then always reports an empty canvas.
        onExcalidrawAPI={handleMount}
        initialData={{ appState: { openSidebar: null } }}
        onChange={handleChange}
      />
    </div>
  );
}
