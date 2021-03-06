import Boom from 'boom';
import { oncePerServer } from './once_per_server';

function reportingFeaturePreRoutingFn(server) {
  const xpackMainPlugin = server.plugins.xpack_main;
  const pluginId = 'reporting';

  // License checking and enable/disable logic
  return function reportingFeaturePreRouting(getReportingFeatureId) {
    return function licensePreRouting(request, reply) {
      const licenseCheckResults = xpackMainPlugin.info.feature(pluginId).getLicenseCheckResults();
      const reportingFeatureId = getReportingFeatureId(request);
      const reportingFeature = licenseCheckResults[reportingFeatureId];
      if (!reportingFeature.showLinks || !reportingFeature.enableLinks) {
        reply(Boom.forbidden(reportingFeature.message));
      } else {
        reply(reportingFeature);
      }
    };
  };
}

export const reportingFeaturePreRoutingFactory = oncePerServer(reportingFeaturePreRoutingFn);
