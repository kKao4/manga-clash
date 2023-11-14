import { auth } from "../auth";

export const getUser = async (token: string | undefined) => {
  if (token) {
    const { user } = await auth(token);
    if (user) {
      let newUser = { ...user };
      newUser = newUser._doc;
      // console.log("🚀 ~ file: account.ts:20 ~ user:", user);
      delete newUser.password;
      // console.log("🚀 ~ file: account.ts:25 ~ newUser:", newUser);
      return newUser;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
