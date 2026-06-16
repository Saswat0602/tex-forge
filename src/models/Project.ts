import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFile {
  name: string;
  content?: string;
  type: "text" | "image" | "pdf";
  url?: string;
  isMain: boolean;
}

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  files: IFile[];
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
    files: [
      {
        name: { type: String, required: true },
        content: { type: String, default: "" },
        type: { type: String, enum: ["text", "image", "pdf"], default: "text" },
        url: { type: String },
        isMain: { type: Boolean, default: false },
      },
    ],
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
