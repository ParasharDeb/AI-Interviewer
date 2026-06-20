import z from "zod";
 
export const userdetails = z.object({
  githuburl: z.string(),
});