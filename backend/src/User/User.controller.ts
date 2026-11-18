import { UserModel } from './User.model';
import omit from 'lodash.omit';

export const UserController = {
  async getUsers() {
    const users = await UserModel.find().sort({ name: 1 }).exec();
    return users.map((user) => omit(user.toObject(), ['password']));
  },

  async getUser(id) {
    const user = await UserModel.find(id).exec();
    return user;
  },

  async updateUser(id, userBody) {
    const user = await UserModel.findByIdAndUpdate(id, userBody);
    return omit({ ...user.toObject(), ...userBody }, ['password']);
  },

  async deleteUser(id) {
    return await UserModel.findByIdAndRemove(id);
  },

  // A client account must have a company and cannot have any other role.
  // Returns an error message, or null when the roles are fine.
  validateClientRoles(roles: string[] = [], company?: string) {
    if (!roles.includes('client')) return null;
    if (roles.length > 1) return 'Client cannot have other roles';
    if (!company) return 'Client must be assigned to a company';
    return null;
  },

  permitOwnerOrAdmin(req, res, next) {
    const requestedId = req.params.id;
    const loggedUser = req.user;

    const isAdmin = loggedUser.roles && loggedUser.roles.includes('admin');
    const isOwner = requestedId === 'me' || requestedId === loggedUser.id;

    if (isAdmin || isOwner) {
      return next();
    }

    return res
      .status(403)
      .json({ message: 'You are not allowed to view this profile.' });
  },
};
