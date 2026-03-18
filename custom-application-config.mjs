import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Ct Reporting Tool',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'mynkt-production',
    },
    production: {
      applicationId: 'cmlfevbsn000801v25qebfuak',
      url: 'https://ct-reporting-tool.vercel.app/',
    },
  },
  oAuthScopes: {
    view: ['view_products', 'view_product_selections', 'view_project_settings'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    /* {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    }, */
    /*  {
       uriPath: 'materials',
       defaultLabel: 'Materials',
       labelAllLocales: [],
       permissions: [PERMISSIONS.View],
     },
     {
       uriPath: 'product-types',
       defaultLabel: 'ProductTypes',
       labelAllLocales: [],
       permissions: [PERMISSIONS.View],
     }, */
    /* {
      uriPath: 'all-products',
      defaultLabel: 'All Products with Attributes',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    }, */
  ],
};

export default config;
