import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  texContent: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
      default: "Untitled Project",
    },
    texContent: {
      type: String,
      default: "\\documentclass{article}\n\\begin{document}\n\nHello World!\n\n\\end{document}",
    },
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
