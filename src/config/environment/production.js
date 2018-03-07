/* eslint no-process-env:0 */

// Production specific configuration
// =================================
module.exports = {
  // Server port
  port: process.env.PORT || 3000,

  // MongoDB connection options
  mongo: {
    uri:
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      'mongodb://localhost/vega-dev',
  },

  services: {
    settings: 'http://settings.gitlab-managed-apps.svc.cluster.local',
    test: 'http://localhost:5002',
  },
};
