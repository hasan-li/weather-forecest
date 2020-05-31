## Running the app

```
yarn install
yarn start
```
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Libraries used
- **axios**: for data fetching. Could be fetch api, but axios gives more flexibility
- **recharts**: for data visualisation
- **node-sass**: for using scss preprocessor

## Notes
- app created by `create-react-app`
- `.env` file added for allowing app to use absolute paths, instead of relative (by adding `NODE_PATH=./` line to it)
- App.js is functional component, using hooks
- Main logic of the application is inside `src/App.js`