import type { IQuestion } from "../contracts/i-question";
import type { ISurvey } from "../contracts/i-survey";
import type { IUser } from "../contracts/i-user";

export default class Survey implements ISurvey {
  id!: string;
  Name!: string;
  Description!: string;
  Users!: IUser[];
  Questions!: IQuestion[];
  constructor(
    data: ISurvey = {
      id: "",
      Name: "",
      Description: "",
      Users: [],
      Questions: [],
    }
  ) {
    this.id = data.id;
    this.Name = data.Name;
    this.Description = data.Description;
    this.Users = data.Users;
    this.Questions = data.Questions;
    this.ValidateName(this.Name);
  }

  ValidateName = (name: string) => {
    name.length ? this.createSurvey() : this.reject();
  };
  createSurvey = () => console.log("create");
  reject = () => console.log("reject");
}
