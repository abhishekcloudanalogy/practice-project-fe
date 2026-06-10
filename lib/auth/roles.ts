/** App roles returned by the backend / stored in the session. */
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Default landing page after login or when access is denied. */
export const HOME_BY_ROLE: Record<Role, string> = {
  [ROLES.USER]: "/dashboard",
  [ROLES.ADMIN]: "/admin",
  [ROLES.SUPER_ADMIN]: "/admin",
};

/** Read role from the NextAuth JWT token. */
export function getRoleFromToken(token: unknown): Role | undefined {
  if (!token || typeof token !== "object") return undefined;

  const role = (token as { user?: { role?: string } }).user?.role;

  if (role === ROLES.USER || role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
    return role;
  }

  return undefined;
}
