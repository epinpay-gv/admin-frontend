/**
 * Simple JWT parser to extract payload without external dependencies.
 */
export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT parse error:", error);
    return null;
  }
}

/**
 * Extract initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
