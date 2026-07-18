import z from "zod";
 
export const userdetails = z.object({
  githuburl: z.string(),
  role: z.string().optional(),
});
export const Signupdetails=z.object({
  username:z.string(),
  email:z.email(),
  password:z.string().min(4).regex(/[!@#$%^&*(),.?":{}|<>]/)
})
export const Signindetails=z.object({
  email:z.email(),
  password:z.string().min(4).regex(/[!@#$%^&*(),.?":{}|<>]/)
})