'use strict';

/**
 * `check-role` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  console.log(config);
  console.log(policyContext.state);
  const { userRole } = config;

    const isEligible =
      policyContext.state.user &&
      policyContext.state.user.role.code === userRole;
  
    if (isEligible) {
      return true;
    }
    return false;
};
