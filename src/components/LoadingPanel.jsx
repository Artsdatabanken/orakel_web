import React, { useEffect, useState } from "react";
import { useTranslation } from "../i18n";
import Spinner from "./Spinner";

const TIMEOUT_MS = 5000;

// Drop-in replacement for the dropzone contents while the AI request
// is in flight. Mirrors iOS LoadingView.swift: centered spinner, and
// after 5 s a "this is taking longer than usual" line + Abort button
// that cancels the in-flight request.
function LoadingPanel({ onAbort }) {
  const { t } = useTranslation();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowTimeout(true), TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="loadingPanel"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size="2.5rem" label={t("identify_description")} />
      {showTimeout && (
        <div className="loadingPanel__timeout">
          <p className="loadingPanel__timeoutMessage">{t("timeout_message")}</p>
          <button
            type="button"
            className="loadingPanel__abortBtn"
            onClick={onAbort}
          >
            {t("abort_button")}
          </button>
        </div>
      )}
    </div>
  );
}

export default LoadingPanel;
