import { policyService } from "../services/policyService.js";
import { successResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";

export const policyController = {
  async listPolicies(req, res, next) {
    try {
      const isCustomer = req.user.roles.includes("CUSTOMER");

      const data = isCustomer
        ? await policyService.listForCustomer(req.user._id)
        : await policyService.listAll();

      return successResponse(res, data, "Policies loaded");
    } catch (error) {
      next(error);
    }
  },

  async getPolicyById(req, res, next) {
    try {
      const policy = await policyService.getById(req.params.policyId);
      const isCustomer = req.user.roles.includes("CUSTOMER");

      if (isCustomer && String(policy.customerId) !== String(req.user._id)) {
        throw new AppError("Policy not found", 404);
      }

      return successResponse(res, policy, "Policy loaded");
    } catch (error) {
      next(error);
    }
  },

  async createPolicy(req, res, next) {
    try {
      const data = await policyService.create({
        ...req.body,
        createdBy: req.user._id
      });

      return successResponse(res, data, "Policy created", 201);
    } catch (error) {
      next(error);
    }
  },

  async updatePolicy(req, res, next) {
    try {
      const data = await policyService.update(req.params.policyId, req.body);
      return successResponse(res, data, "Policy updated");
    } catch (error) {
      next(error);
    }
  }
};