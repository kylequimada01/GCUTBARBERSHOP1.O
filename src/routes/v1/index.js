const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const serviceRoute = require('./service.route'); // Import the service route
const serviceCategoryRoute = require('./serviceCategory.route'); // Import the service category route
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/services',
    route: serviceRoute, // Add service route to default routes
  },
  {
    path: '/service-categories',
    route: serviceCategoryRoute, // Add service category route to default routes
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
