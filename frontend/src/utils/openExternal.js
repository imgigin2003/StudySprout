// Opens a URL in the user's default browser across every target:
// - Tauri desktop: the webview blocks plain target="_blank" links, so we hand
//   the URL to the OS via the opener plugin.
// - Web & Capacitor (iOS/Android): window.open with _blank opens the system
//   browser for external URLs.
export async function openExternal(url) {
  if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
    try {
      const { openUrl } = await import("@tauri-apps/plugin-opener");
      await openUrl(url);
      return;
    } catch {
      // Fall through to the web behavior if the plugin call fails.
    }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
