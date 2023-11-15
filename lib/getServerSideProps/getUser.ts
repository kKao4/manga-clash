import User from "@/models/user";

export const getUser = async (_id: string) => {
    const user = await User.findById(_id);
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
};
