import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import http2 from 'node:http2';
import isEmail from 'validator/lib/isEmail';
import {
  defaultUserAbout, defaultUserAvatar, defaultUserName, rexExpUrl,
} from '../utils/constants';
import { ModifiedError } from '../errors';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    email: {
      type: 'String',
      required: true,
      unique: true,
      validate: (value: string): boolean => isEmail(value),
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 20,
      default: defaultUserName,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: defaultUserAbout,
    },
    avatar: {
      type: String,
      default: defaultUserAvatar,
      validate: (value: string): boolean => rexExpUrl.test(value),
    },
  },
  {
    versionKey: false,
  },
);

userSchema.static('findUserByCredentials', async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new ModifiedError('Неправильные почта или пароль', HTTP_STATUS_UNAUTHORIZED);
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new ModifiedError('Неправильные почта или пароль', HTTP_STATUS_UNAUTHORIZED);
  }

  return user;
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
