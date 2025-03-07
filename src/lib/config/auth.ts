// config/auth.ts

const config = {
  routes: {
    login: {
      link: '/auth/login'
    },
    signup: {
      link: '/auth/signup'
    },
    forgotPassword: {
      link: '/auth/forgot-password'
    },
    magiclink: {
      link: '/auth/magic-link'
    },
    checkEmail: {
      link: '/auth/check-email'
    },
    confirmEpired: {
      link: '/auth/confirm-expired'
    },
    completeSignup: {
      link: '/auth/complete-signup'
    }
  },
  redirects: {
    toDashboard: '/dashboard/tasks',
    toSubscription: '/dashboard/settings/subscription',
    toBilling: '/dashboard/settings/billing',
    requireAuth: '/auth/auth-required',
    authConfirm: '/auth/auth-confirm',
    toProfile: '/dashboard/settings/profile',
    requireSub: '/dashboard/settings/subscription-required',
    toAddSub: '/dashboard/settings/add-subscription'
  }
};

export default config;
