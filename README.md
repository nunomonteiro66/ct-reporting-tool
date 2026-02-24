<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://unpkg.com/@commercetools-frontend/assets/logos/commercetools_primary-logo_horizontal_RGB.png">
  </a>
  <b>Custom Application starter template in TypeScript</b>
</p>

This is the [TypeScript](https://www.typescriptlang.org/) version of the starter template to [develop Custom Applications](https://docs.commercetools.com/merchant-center-customizations/custom-applications) for the Merchant Center.

# Installing the template

Read the [Getting started](https://docs.commercetools.com/merchant-center-customizations/custom-applications) documentation for more information.

# Developing the Custom Application

Learn more about [developing a Custom Application](https://docs.commercetools.com/merchant-center-customizations/development) and [how to use the CLI](https://docs.commercetools.com/merchant-center-customizations/api-reference/cli).

# Description
This is a custom application for commerce tools that allows the export and view of all products, their variants, and all their attributes. In adition, it checks if each attribute is applicable for each variant, and adds a "N/A" in case it is not.

Currently the application allows for the export in the xls and csv formats.

# Setup
Install packages with 
```bash 
pnpm install
```, 

then start with 
```bash 
pnpm start
```

The authentication is made with the commercetools account.
