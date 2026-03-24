import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import omit from 'lodash.omit';
import { UserModel } from '../User/User.model';

export const AuthController = {
  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email }).exec();
    return omit(user.toObject(), ['password']);
  },
  async signUser(email: string, password: string): Promise<null | string> {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }
    return jsonwebtoken.sign(
      { sub: email },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '24h',
      },
    );
  },
  async addUser(user) {
    await UserModel.validate(user);
    const newUser = await UserModel.create({
      ...user,
      password: await bcrypt.hash(user.password, 8),
    });
    return omit(newUser.toObject(), ['password']);
  },
};
