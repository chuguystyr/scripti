import jwt from "jsonwebtoken";
export const protector: (
  token: string,
) => Promise<{ id: string } | { message: string }> = async (token) => {
  if (!token) {
    return { message: "Unathorised" };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decoded;
  } catch (error) {
    return { message: "Unathorised" };
  }
};
