import { z } from "zod";

export const CardFormResponseSchema = z.object({
  cardUUID: z.string().uuid(),
  responseUUID: z.string().uuid(),
  imageUrl: z.string(),
  memoryResponse: z.string().min(1),
  descriptionResponse: z.string().min(1),
  finalMessageResponse: z.string().min(1),
  name: z.string().min(1),
});
export type CardFormResponse = z.infer<typeof CardFormResponseSchema>;

export interface FunctionResponse {
  ok: boolean;
}

export interface FunctionErrorResponse extends FunctionResponse {
  ok: false;
  message: string;
}

export const RegisterMakeAWishEmailSchema = z.object({
  email: z.string().email(),
  cardUUID: z.string().uuid(),
});

export type RegisterMakeAWishEmail = z.infer<
  typeof RegisterMakeAWishEmailSchema
>;
