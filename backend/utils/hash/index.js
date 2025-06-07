import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword) => {
  try {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error('Lỗi khi mã hóa mật khẩu');
  }
};

export const comparePassword = async (plainPassword, hash) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hash);
    return isMatch;
  } catch (error) {
    throw new Error('Lỗi khi so sánh mật khẩu');
  }
};