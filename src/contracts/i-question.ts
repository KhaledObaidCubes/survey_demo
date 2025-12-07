import type { QuestionType } from "./../types/i-questions-types";

interface IQuestion {
  id: string;
  text: string;
  questionType: QuestionType;
  choices: string[];
}
export type { IQuestion };
