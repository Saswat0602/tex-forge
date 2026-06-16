"use server";

import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { RegisterInput, RegisterSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";

export type ActionResponse = {
  ok: boolean;
  error?: string;
  data?: unknown;
};

export async function registerUser(input: RegisterInput): Promise<ActionResponse> {
  try {
    // 1. Validate Input
    const validatedData = RegisterSchema.parse(input);
    const { email, password, name } = validatedData;

    // 2. Connect to Database
    await dbConnect();

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { ok: false, error: "A user with this email already exists." };
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // 6. Return Success (excluding password)
    return {
      ok: true,
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error: unknown) {
    console.error("Registration Error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return { ok: false, error: "Invalid input data." };
    }
    return { ok: false, error: "Something went wrong during registration." };
  }
}
