import {
  exchangeAuthorizationCode,
  getFrontendKeycloakConfig,
  verifyKeycloakAccessToken
} from "../services/keycloakService.js";
import { findOrProvisionUserFromKeycloak } from "../services/userProvisioningService.js";
import { successResponse } from "../utils/apiResponse.js";

export const keycloakController = {
  async getConfig(req, res, next) {
    try {
      return successResponse(
        res,
        getFrontendKeycloakConfig(),
        "Keycloak configuration loaded"
      );
    } catch (error) {
      next(error);
    }
  },

  async exchangeCode(req, res, next) {
    try {
      const { code, codeVerifier, redirectUri } = req.body;

      const tokenSet = await exchangeAuthorizationCode({
        code,
        codeVerifier,
        redirectUri
      });

      const identity = await verifyKeycloakAccessToken(tokenSet.access_token);
      const localUser = await findOrProvisionUserFromKeycloak(identity);

      const responseUser =
        typeof localUser.toObject === "function"
          ? localUser.toObject()
          : localUser;

      return successResponse(
        res,
        {
          accessToken: tokenSet.access_token,
          refreshToken: tokenSet.refresh_token,
          idToken: tokenSet.id_token,
          expiresIn: tokenSet.expires_in,
          tokenType: tokenSet.token_type,
          user: responseUser
        },
        "Keycloak authentication successful"
      );
    } catch (error) {
      next(error);
    }
  }
};