import { Member } from "../member";
export type Organization = {
  id: string;
  active: boolean;
  planCode: string;
  members: Member[];
}

export * from './get-organizations';