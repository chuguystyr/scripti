import { Types } from "mongoose"

export default interface Task {
  _id: Types.ObjectId | string
  userId: Types.ObjectId | string
  title: string
  type: TaskType
  deadline: Date
  course: Types.ObjectId | string
  status: string
  description?: string
}

export enum TaskType {
  REPORT = "report",
  TEST = "test",
  QUIZ = "quiz",
  PROJECT = "project",
  PRESENTATION = "presentation",
  ESSAY = "essay",
  RESEARCH = "research",
  ARTICLE = "article",
  PAPER = "paper",
  THESIS = "thesis",
}

export enum TaskStatus {
  NEW = "new",
  IN_PROGRESS = "in progress",
  DONE = "done",
}
