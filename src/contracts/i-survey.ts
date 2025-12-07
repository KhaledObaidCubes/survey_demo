import type { IUser } from "./i-user";
import type { IQuestion } from "./i-question";
interface ISurvey {
  id: string;
  Name: string;
  Description: string;
  Users: IUser[];
  Questions: IQuestion[];
}

export type { ISurvey };
