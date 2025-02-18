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
    }
  },
  redirects: {
    toDashboard: '/dashboard/tasks',
    toSubscription: '/dashboard/settings/subscription',
    toBilling: '/dashboard/settings/billing',
    requireAuth: '/auth/auth-required',
    authConfirm: '/auth/auth-confirm',
    callback: '/api/auth-callback',
    toProfile: '/dashboard/settings/profile',
    requireSub: '/dashboard/settings/subscription-required',
    toAddSub: '/dashboard/settings/add-subscription',
    checkEmail: '/auth/check-email'
  }
};

export default config;
