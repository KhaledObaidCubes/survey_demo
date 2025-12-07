import type { Permission as userPermission } from "../types/i-permission";
interface IUser {
  id: string;
  UserName: string;
  Permission: userPermission;
}

export type { IUser };
