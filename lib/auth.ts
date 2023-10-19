import jwt from "jsonwebtoken";
import User from "@/models/user";

export async function auth(token: string) {
  const decoded: any = jwt.verify(token, process.env.SECRET_TOKEN_KEY!);
  const user = await User.findById(decoded._id);
  return { user: user, _id: decoded._id };
}
