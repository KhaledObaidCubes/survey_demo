import type { IQuestion } from "../contracts/i-question";
import type { ISurvey } from "../contracts/i-survey";
import type { IUser } from "../contracts/i-user";
import type { Permission } from "../types/i-permission";

export default class Survey implements ISurvey {
  id: string;
  Name: string;
  Description: string;
  Users: IUser[];
  Questions: IQuestion[];

  constructor(
    data: ISurvey = {
      id: "",
      Name: "",
      Description: "",
      Users: [],
      Questions: [],
    }
  ) {
    this.id = data.id || this.generateId();
    this.Name = data.Name;
    this.Description = data.Description;
    this.Users = data.Users;
    this.Questions = data.Questions;
    this.ValidateName(this.Name);
  }

  // Validation Methods
  ValidateName = (name: string): void => {
    if (name && name.length > 0) {
      this.createSurvey();
    } else {
      this.reject();
    }
  };

  // ValidateDescription = (description: string): boolean => {
  //   return description.length >= 10;
  // };

  ValidateSurvey = (): boolean => {
    if (!this.Name || this.Name.length === 0) {
      throw new Error("Survey name is required");
    }

    if (this.Questions.length === 0) {
      throw new Error("Survey must have at least one question");
    }

    // if (!this.ValidateDescription(this.Description)) {
    //   throw new Error("Description must be at least 10 characters");
    // }

    return true;
  };

  // CRUD Operations
  createSurvey = (): void => {
    console.log("Survey created successfully");
  };

  updateSurvey = (updates: Partial<ISurvey>): Survey => {
    if (updates.Name !== undefined) {
      this.Name = updates.Name;
    }
    if (updates.Description !== undefined) {
      this.Description = updates.Description;
    }
    if (updates.Users !== undefined) {
      this.Users = updates.Users;
    }
    if (updates.Questions !== undefined) {
      this.Questions = updates.Questions;
    }
    console.log("Survey updated successfully");
    return this;
  };

  deleteSurvey = (): boolean => {
    console.log("Survey deleted successfully");
    return true;
  };

  reject = (): void => {
    console.log("Survey creation rejected - validation failed");
    throw new Error("Invalid survey data");
  };

  // Question Management
  addQuestion = (question: IQuestion): IQuestion[] => {
    const exists = this.Questions.some((q) => q.id === question.id);
    if (exists) {
      throw new Error("Question with this ID already exists");
    }
    this.Questions.push(question);
    return this.Questions;
  };

  removeQuestion = (questionId: string): boolean => {
    const index = this.Questions.findIndex((q) => q.id === questionId);
    if (index !== -1) {
      this.Questions.splice(index, 1);
      return true;
    }
    return false;
  };

  updateQuestion = (
    questionId: string,
    updates: Partial<IQuestion>
  ): IQuestion | null => {
    const question = this.Questions.find((q) => q.id === questionId);
    if (question) {
      Object.assign(question, updates);
      return question;
    }
    throw new Error("Question not found");
  };

  getQuestionById = (questionId: string): IQuestion | null => {
    return this.Questions.find((q) => q.id === questionId) || null;
  };

  reorderQuestions = (questionIds: string[]): void => {
    const reordered: IQuestion[] = [];
    for (const id of questionIds) {
      const question = this.Questions.find((q) => q.id === id);
      if (question) {
        reordered.push(question);
      }
    }
    this.Questions = reordered;
  };

  // User Management
  addUser = (user: IUser): boolean => {
    const exists = this.Users.some((u) => u.id === user.id);
    if (exists) {
      throw new Error("User already added to survey");
    }
    this.Users.push(user);
    return true;
  };

  removeUser = (userId: string): boolean => {
    const index = this.Users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.Users.splice(index, 1);
      return true;
    }
    return false;
  };

  updateUserPermission = (
    userId: string,
    newPermission: Permission
  ): IUser | null => {
    const user = this.Users.find((u) => u.id === userId);
    if (user) {
      user.Permission = newPermission;
      return user;
    }
    throw new Error("User not found");
  };

  getUserById = (userId: string): IUser | null => {
    return this.Users.find((u) => u.id === userId) || null;
  };

  checkUserPermission = (
    userId: string,
    requiredPermission: Permission
  ): boolean => {
    const user = this.getUserById(userId);
    if (!user) {
      return false;
    }

    const permissionLevels: Record<Permission, number> = {
      read: 1,
      write: 2,
      delete: 3,
      owner: 4,
    };

    return (
      permissionLevels[user.Permission] >= permissionLevels[requiredPermission]
    );
  };

  // Utility Methods
  getSurveyStats = () => {
    const questionTypeBreakdown: Record<string, number> = {};
    this.Questions.forEach((q) => {
      questionTypeBreakdown[q.questionType] =
        (questionTypeBreakdown[q.questionType] || 0) + 1;
    });

    const permissionBreakdown: Record<string, number> = {};
    this.Users.forEach((u) => {
      permissionBreakdown[u.Permission] =
        (permissionBreakdown[u.Permission] || 0) + 1;
    });

    return {
      totalQuestions: this.Questions.length,
      totalUsers: this.Users.length,
      questionTypeBreakdown,
      permissionBreakdown,
    };
  };

  clone = (): Survey => {
    const clonedData: ISurvey = {
      id: this.generateId(),
      Name: this.Name + " (Copy)",
      Description: this.Description,
      Users: [],
      Questions: JSON.parse(JSON.stringify(this.Questions)),
    };
    return new Survey(clonedData);
  };

  exportToJSON = (): string => {
    return JSON.stringify({
      id: this.id,
      Name: this.Name,
      Description: this.Description,
      Users: this.Users,
      Questions: this.Questions,
    });
  };

  importFromJSON = (jsonString: string): void => {
    const data = JSON.parse(jsonString);
    this.id = data.id || this.id;
    this.Name = data.Name || this.Name;
    this.Description = data.Description || this.Description;
    this.Users = data.Users || this.Users;
    this.Questions = data.Questions || this.Questions;
  };

  // Helper Methods
  private generateId = (): string => {
    return `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
}
