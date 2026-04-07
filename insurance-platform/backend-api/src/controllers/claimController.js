import { claimService } from "../services/claimService.js";
import { successResponse } from "../utils/apiResponse.js";

function getRoleNames(user) {
  return (user?.roles || []).map((role) => {
    if (typeof role === "string") {
      return role;
    }

    if (role && typeof role === "object" && role.name) {
      return role.name;
    }

    return String(role);
  });
}

export const claimController = {
  async listClaims(req, res, next) {
    try {
      const roleNames = getRoleNames(req.user);
      const isCustomer = roleNames.includes("CUSTOMER");

      const data = isCustomer
        ? await claimService.listForCustomer(req.user._id)
        : await claimService.listAll();

      return successResponse(res, data, "Claims loaded");
    } catch (error) {
      next(error);
    }
  },

  async getClaimById(req, res, next) {
    try {
      const data = await claimService.getById(req.params.claimId);

      const roleNames = getRoleNames(req.user);
      const isCustomer = roleNames.includes("CUSTOMER");

      //ownership check
      if (
        isCustomer &&
        data.submittedBy.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Access denied: not your claim" });
      }

      return successResponse(res, data, "Claim loaded");
    } catch (error) {
      next(error);
    }
  },

  async createClaim(req, res, next) {
    try {
      const data = await claimService.create(req.body, req.user);
      return successResponse(res, data, "Claim created", 201);
    } catch (error) {
      next(error);
    }
  },

  async reviewClaim(req, res, next) {
    try {
      const data = await claimService.review(
        req.params.claimId,
        req.body,
        req.user
      );

      return successResponse(res, data, "Claim reviewed");
    } catch (error) {
      next(error);
    }
  },

  async deleteClaim(req, res, next) {
    try {
      const roleNames = getRoleNames(req.user);
      const isCustomer = roleNames.includes("CUSTOMER");

      const claim = await claimService.getById(req.params.claimId);

      //ownership check for customer
      if (
        isCustomer &&
        claim.submittedBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      await claimService.delete(req.params.claimId, req.user);

      return successResponse(res, null, "Claim deleted");
    } catch (error) {
      next(error);
    }
  }
};