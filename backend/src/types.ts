import z, { email } from "zod";
 
export const userdetails = z.object({
  githuburl: z.string(),
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