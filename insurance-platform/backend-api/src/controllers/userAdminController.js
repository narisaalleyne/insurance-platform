import { userAdminService } from "../services/userAdminService.js";
import { successResponse } from "../utils/apiResponse.js";

export const userAdminController = {
  async listUsers(req, res, next) {
    try {
      const data = await userAdminService.listUsers();
      return successResponse(res, data, "Users loaded");
    } catch (error) {
      next(error);
    }
  },

  async listCustomers(req, res, next) {
    try {
      const data = await userAdminService.listCustomers();
      return successResponse(res, data, "Customers loaded");
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const data = await userAdminService.updateUserStatus(
        req.params.userId,
        req.body.accountStatus
      );
      return successResponse(res, data, "User status updated");
    } catch (error) {
      next(error);
    }
  },

  //view single user
  async getUserById(req, res, next) {
    try {
      const data = await userAdminService.getUserById(req.params.userId);
      return successResponse(res, data, "User loaded");
    } catch (error) {
      next(error);
    }
  },

  //assign role
  async assignRole(req, res, next) {
    try {
      const data = await userAdminService.assignRole(
        req.params.userId,
        req.body.roleId
      );
      return successResponse(res, data, "Role assigned");
    } catch (error) {
      next(error);
    }
  },

  //remove role
  async removeRole(req, res, next) {
    try {
      const data = await userAdminService.removeRole(
        req.params.userId,
        req.params.roleId
      );
      return successResponse(res, data, "Role removed");
    } catch (error) {
      next(error);
    }
  }
};