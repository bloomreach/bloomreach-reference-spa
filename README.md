# brX SaaS + React = ♥️

Reference SPA using the Bloomreach Experience [React SDK](https://www.npmjs.com/package/@bloomreach/react-sdk).
The app is created using [create-react-app](https://github.com/facebook/create-react-app).

## Install and run

Copy `.env.dist` file to `.env` and specify the brX SaaS instance to fetch the page model from:
```
REACT_APP_BRXM_ENDPOINT=https://project.bloomreach.io/delivery/site/v1/channels/brxsaas/pages
```

Then, build and run the React app as follows:

```bash
npm ci
npm start
```

## Available scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open <http://localhost:3000> to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
