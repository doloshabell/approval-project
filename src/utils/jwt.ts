// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJWT<T = any>(token: string): T | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid JWT", error);
      return null;
    }
  }
  