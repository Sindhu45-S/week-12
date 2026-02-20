import { z } from "zod";

// Task Schema - for creating and updating tasks
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title cannot be empty")
    .min(3, "Task title must be at least 3 characters")
    .max(200, "Task title cannot exceed 200 characters"),
  priority: z
    .enum(["Low", "Medium", "High"])
    .optional()
    .default("Low"),
  due_date: z
    .string()
    .optional()
    .nullable(),
});

// Sign Up Schema - for user registration
export const signUpSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(255, "Email cannot exceed 255 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Sign In Schema - for user login
export const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Update Task Schema - for partial updates
export const updateTaskSchema = taskSchema.partial();

// Types for TypeScript
export type TaskInput = z.infer<typeof taskSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
