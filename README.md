# Bloomreach Content + React = ♥️

Reference SPA using the Bloomreach Experience [React SDK](https://www.npmjs.com/package/@bloomreach/react-sdk).
The app is created using [Next.js](https://nextjs.org/).

## Install and run

Copy `.env.dist` file to `.env` and specify the brX SaaS instance to fetch the page model from:

```
NEXT_PUBLIC_BRXM_ENDPOINT=https://brx-saas-eng02.bloomreach.io/delivery/site/v1/channels/brxsaas/pages
```

By default, multi-tenant mode is **disabled**.
You may enable multi-tenant support by setting the environment variable NEXT_PUBLIC_BR_MULTI_TENANT_SUPPORT to true.

```
NEXT_PUBLIC_BR_MULTI_TENANT_SUPPORT=true
```

Then, build and run the Next.js app as follows:

```bash
npm ci
npm run build
npm run start
```

## Available scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open <http://localhost:3000> to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://nextjs.org/docs/deployment) for more information.
