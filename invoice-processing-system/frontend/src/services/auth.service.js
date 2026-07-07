const AUTH_COOKIE = "bip_auth";

export function login() {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE}=1; path=/`;
  }

  return Promise.resolve({ success: true });
}

export function signup() {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE}=1; path=/`;
  }

  return Promise.resolve({ success: true });
}

export function logout() {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
