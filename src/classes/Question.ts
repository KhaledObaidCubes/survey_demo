import type { IQuestion } from "../contracts/i-question";
import type { QuestionType } from "../types/i-questions-types";

export default class Question implements IQuestion {
  id: string;
  text: string;
  questionType: QuestionType;
  choices: string[];

  constructor(
    data: IQuestion = {
      id: "",
      text: "",
      questionType: "text",
      choices: [],
    }
  ) {
    this.id = data.id || this.generateId();
    this.text = data.text;
    this.questionType = data.questionType;
    this.choices = data.choices || [];

    this.ValidateQuestion();
  }

  // Validation Methods
  ValidateText = (text: string): boolean => {
    if (!text || text.length < 3) {
      throw new Error("Question text must be at least 3 characters");
    }

    if (text.length > 500) {
      throw new Error("Question text cannot exceed 500 characters");
    }

    return true;
  };

  ValidateQuestionType = (type: QuestionType): boolean => {
    const validTypes: QuestionType[] = [
      "dropdown",
      "radio",
      "checkbox",
      "text",
      "rating",
    ];

    if (!validTypes.includes(type)) {
      throw new Error("Invalid question type");
    }

    return true;
  };

  ValidateChoices = (): boolean => {
    if (this.isChoiceBasedType()) {
      if (this.choices.length === 0) {
        throw new Error("Choices are required for this question type");
      }

      if (this.choices.length < 2) {
        throw new Error("At least 2 choices are required");
      }

      const uniqueChoices = new Set(this.choices);
      if (uniqueChoices.size !== this.choices.length) {
        throw new Error("Duplicate choices are not allowed");
      }
    }

    return true;
  };

  ValidateQuestion = (): boolean => {
    this.ValidateText(this.text);
    this.ValidateQuestionType(this.questionType);
    this.ValidateChoices();
    return true;
  };

  // Choice Management
  addChoice = (choice: string): string[] => {
    if (!this.isChoiceBasedType()) {
      throw new Error("Choices not applicable for this question type");
    }

    if (!choice || choice.trim().length === 0) {
      throw new Error("Choice text cannot be empty");
    }

    if (this.choices.includes(choice)) {
      throw new Error("Duplicate choice");
    }

    this.choices.push(choice);
    return this.choices;
  };

  removeChoice = (choiceIndex: number): string[] => {
    if (!this.isChoiceBasedType()) {
      throw new Error("Choices not applicable for this question type");
    }

    if (choiceIndex < 0 || choiceIndex >= this.choices.length) {
      throw new Error("Invalid choice index");
    }

    if (this.choices.length <= 2) {
      throw new Error("Cannot remove choice - minimum 2 choices required");
    }

    this.choices.splice(choiceIndex, 1);
    return this.choices;
  };

  updateChoice = (choiceIndex: number, newText: string): string[] => {
    if (!this.isChoiceBasedType()) {
      throw new Error("Choices not applicable for this question type");
    }

    if (choiceIndex < 0 || choiceIndex >= this.choices.length) {
      throw new Error("Invalid choice index");
    }

    if (!newText || newText.trim().length === 0) {
      throw new Error("Choice text cannot be empty");
    }

    // Check for duplicates excluding the current index
    const otherChoices = this.choices.filter((_, i) => i !== choiceIndex);
    if (otherChoices.includes(newText)) {
      throw new Error("Duplicate choice");
    }

    this.choices[choiceIndex] = newText;
    return this.choices;
  };

  reorderChoices = (newOrder: number[]): string[] => {
    if (newOrder.length !== this.choices.length) {
      throw new Error("Invalid reorder array");
    }

    const reordered = newOrder.map((index) => {
      if (index < 0 || index >= this.choices.length) {
        throw new Error("Invalid index in reorder array");
      }
      return this.choices[index];
    });

    this.choices = reordered;
    return this.choices;
  };

  // Question Text Management
  updateText = (newText: string): string => {
    this.ValidateText(newText);
    this.text = newText;
    return this.text;
  };

  // Question Type Management
  changeQuestionType = (newType: QuestionType): QuestionType => {
    this.ValidateQuestionType(newType);

    const wasChoiceBased = this.isChoiceBasedType();
    const willBeChoiceBased =
      newType === "dropdown" || newType === "radio" || newType === "checkbox";

    if (willBeChoiceBased && !wasChoiceBased) {
      // Initialize with default choices
      this.choices = ["Option 1", "Option 2"];
    } else if (!willBeChoiceBased && wasChoiceBased) {
      // Clear choices
      this.choices = [];
    }

    this.questionType = newType;
    return this.questionType;
  };

  // Utility Methods
  clone = (): Question => {
    const clonedData: IQuestion = {
      id: this.generateId(),
      text: this.text,
      questionType: this.questionType,
      choices: [...this.choices],
    };
    return new Question(clonedData);
  };

  isChoiceBasedType = (): boolean => {
    return ["dropdown", "radio", "checkbox"].includes(this.questionType);
  };

  getChoiceCount = (): number => {
    return this.choices.length;
  };

  hasChoice = (choiceText: string): boolean => {
    return this.choices.includes(choiceText);
  };

  toJSON = () => {
    return {
      id: this.id,
      text: this.text,
      questionType: this.questionType,
      choices: this.choices,
    };
  };

  // Answer Validation
  validateAnswer = (answer: any): boolean => {
    switch (this.questionType) {
      case "text":
        if (typeof answer !== "string") {
          throw new Error("Answer must be a string");
        }
        break;

      case "radio":
      case "dropdown":
        if (typeof answer !== "string") {
          throw new Error("Answer must be a string");
        }
        if (!this.choices.includes(answer)) {
          throw new Error("Answer must be one of the available choices");
        }
        break;

      case "checkbox":
        if (!Array.isArray(answer)) {
          throw new Error("Answer must be an array");
        }
        for (const selected of answer) {
          if (!this.choices.includes(selected)) {
            throw new Error(
              `"${selected}" is not a valid choice for this question`
            );
          }
        }
        break;

      case "rating":
        if (typeof answer !== "number") {
          throw new Error("Answer must be a number");
        }
        if (answer < 1 || answer > 5) {
          throw new Error("Rating must be between 1 and 5");
        }
        break;

      default:
        throw new Error("Unknown question type");
    }

    return true;
  };

  // Helper Methods
  private generateId = (): string => {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
}
