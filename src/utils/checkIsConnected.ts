/**
 * Lightweight connectivity check that doesn't require any native modules.
 * Sends a HEAD request to a reliable endpoint and considers the device
 * online if the request resolves within the timeout.
 */
export async function checkIsConnected(timeoutMs = 5000): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Using Google's generate_204 endpoint — returns a 204 with no body,
    // minimal data transfer, widely available.
    await fetch('https://clients3.google.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
