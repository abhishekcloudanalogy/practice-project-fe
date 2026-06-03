import { DefaultSession } from "next-auth";

type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  authProvider: string;
};

declare module "next-auth" {
  interface User extends AppUser {
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: AppUser & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    providerAccessToken?: string;
    user?: AppUser;
  }
}