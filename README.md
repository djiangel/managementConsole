## About

The management console allows users to manipulate Gastrograph resources. It is bootstrapped with `create-react-app`.

The current codebase contains a mix of TypeScript and JavaScript (Flow) source codes,
although the entire codebase should be migrated to TypeScript at some point in time.

## Setup

Ensure that the following tools have been installed on your machine:

- [Node & Node Package Manager](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/lang/en/)

At the time of this writing, `yarn` is the preferred package manager although `npm` has to be installed as well.
This is because deployment requires `yarn.lock` that is generated by `yarn` rather than `package.lock` that is generated by `npm`.

To get started, `$ cd` into the project directory and perform a `$ yarn install`.

Next, run the script `$ ./start.sh` (to run the code base against the staging environment) or `$ ./start.local.sh` (to run the codebase against your local environment; read more [here](https://gastrograph.atlassian.net/wiki/spaces/SD/pages/58916879/Setup+Local+Web+Server+Database?atlOrigin=eyJpIjoiM2NiYzA5ZTY1NWExNDBiM2I5MTc2NDY3OGU5YTk0NDUiLCJwIjoiYyJ9)).

Go to your browser and access the management console with the address `localhost:8080`.

## Structure

The structure of codebase is designed with separation of concern in mind. A high level explanation of each component
(used loosely in this case; not to be confused with component in React's sense) is presented in the table below:

| Component    | Functionality                                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `actions`    | Contains redux actions.                                                                                                                                                                                                        |
| `components` | Contains reusable React components. <br> Theoretically, React components here should be functional components since reusable components should contain minimal business logic (even with Hooks)                                |
| `constants`  | As the name suggests, this contains constants used globally throughout the app.                                                                                                                                                |
| `consumers`  | Server requests related stuff i.e. you'll probably never have to deal with this.                                                                                                                                               |
| `containers` | Contains React components that are specific to a particular screen i.e non-reusable components. <br> Theoretically, React components here should be class components since business logic is encapsulated in these components. |
| `graphql`    | Contains GraphQL query/mutation strings.                                                                                                                                                                                       |
| `guards`     | Not exactly sure what this is ... probably for exception handling?                                                                                                                                                             |
| `i18n`       | Files related to localization and translations (using react-i18n).                                                                                                                                                             |
| `reducers`   | Contains redux reducers.                                                                                                                                                                                                       |
| `sagas`      | Contains [redux saga](https://redux-saga.js.org/).                                                                                                                                                                             |
| `selectors`  | Reusable functions to access redux store.                                                                                                                                                                                      |
| `store`      | Configurations for redux store.                                                                                                                                                                                                |
| `styles`     | Files related, or remotely related to styling go into here if they do not belong to a specific component or container.                                                                                                         |
| `utils`      | Contains helper functions that are used globally across the project.                                                                                                                                                           |

### React Components

By now you'd have realized that React components reside in either the `components` or `containers` folder depending on whether they should be or can be reused.
Within each React component, there is some form of standardization that has been established as far as the naming convention and structure of each component are concerned.

Regardless of whether the component is written in TypeScript or JavaScript, most components comprise of the following three files (using `container/Panel` as an example):

| File                                                    | Purpose                                                                                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`                                              | Exports the main component source code.                                                                                              |
| `<MainComponentName>.tsx` eg. `Panel.tsx`               | The main component source code. Main component source file should share the same name as the folder that the source file resides in. |
| `<MainComponentName>.module.css` eg. `Panel.module.css` | The styling used for the component. We're using `css-loader` from `webpack` to handle CSS styling of components.                     |

For more complex components, it might make sense to abstract certain components from the main component source file and place them in separate source files (sub-components) as in the case of `containers/CreateReview`.

However, these sub-components should **never** be named as though they are the main component (i.e. take the name of the folder that they reside in) to avoid confusion.

You may also come across additional styling files like `StyledComponents.js` and `useStyles.ts`. The former is a result of using [styled-components](https://www.styled-components.com/) package while the latter is a result of using [Material-UI's](https://material-ui.com/styles/api/) styling API.
I have been avoiding `styled-components` like a plague because it does not play well with `Prettier` and hampers the readability of the code.
`Material-UI`'s styling API is only used when styling `Material-UI` components as most of these components consist of sub-components, and to perform accurate styling, using its styling API is favored over `webpack/css-loader` (although the latter does work for simpler components).

## Testing

The management console uses [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/docs/guides/jest.html) for unit testings.

Unit tests for each component should reside within the `__test__` folder in each component's folder, and should be named in the format `<Component's Name>.spec.js` or `<Component's Name>.spec.ts`.

Given the configuration of Jest in this codebase, both steps are required for test suites to be picked up by Jest.

To run the test suites, simply do `$ yarn test`.

Unfortunately at the time of this writing, no E2E testing tools have been deployed, although this should be done at some point in time later with Selenium.

## Localization

The management console uses [React-i18n](https://react.i18next.com/) for localization. Most of the `i18n` config files and translation files can be found in the folder `i18n`.

The way that `React-i18n` works is that each translation file is essentially a JavaScript object containing key-value pairs.
Components obtain the correct translation for each word by looking up the corresponding using the keys in each translation file.

To create a new translation file, create a `.js` file in the directory `i18n/translations` and name it as the corresponding ISO 639-1 language code
(eg. a Japanese translation file should have the file name `ja.js`). Then, import the translation file into `i18n/index.js` and add the new language under `resources`.
A list of ISO 639-1 language code can be retrieve [here](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
This is important as localization of date/time using `moment.js` should be dependent on `i18n` and to take advantage of `moment.js` built-in localization capability, locale has to adhere to ISO 639-1 standard.

[React-i18n Quick Start Guide](https://react.i18next.com/guides/quick-start) provides succinct explanation and examples of how you can use its APIs to obtain the translated terms in those translation files.

On its initial launch, `i18n` will be defaulted to English. Once user has logged in, `containers/AppHeaderViewerMenu` will attempt to retrieve user's preferred language and set the preferred language as the interface language via `i18n`.
If the preferred language is not available, English will remain as the interface language.

Whenever an user attempts to change the interface language through `/containers/LanguageSelection`, the new language will be set as the user's preferred language.
Note that the setting of preferred language on the console will be carried over to the app as well
i.e. choosing Japanese as the interface language on the console will result in the app showing up as Japanese the next time the user logs in to the app.

### Obtaining Missing Translations

To obtain a `.csv` file of missing translations, ensure that you have `tsc` installed via npm with `$ npm install -g typescript`.

`$ cd` into `src/script` and run `$ tsc generateMissingTranslations.ts`. `generateMissingTranslations.js` should be transpiled. Run the transpiled file with `$ node generateMissingTranslations.js`.
The `.csv` files containing the missing translations for each language should be generated in the same folder.

### Testing

Running Jest with `react-i18n` is, for the lack of a better word, a pain in the ass, because `react-i18n` does not actually execute in the test environment.
A mock of `react-i18n` is required for Jest to run properly.
The mock file can be found in `./config/jest/reacti18nextMock.js`.

With the mock `react-i18n`, the actual terms are not returned from the key-value pairs.
Instead, the path of the key is returned in the test environment.
For instance, the following component:

```
<div>{t('navigation.products')}</div>
```

will not actually return `<div>Products</div>` in the testing environment.
Instead what Jest sees is `<div>navigation.products</div>`.
It is important to take this into account when writing test cases that compare expected and actual rendering of components.

## Other Useful Information

### Create/Edit Product - Image Upload

The core image upload component can be found in `components/FieldImageInput` which basically runs off [FilePond](https://github.com/pqina/filepond).
The default use case for filepond differs greatly from ours (sync uploading vs async uploading) resulting in huge changes in configuration of filepond instances.
Consult the [API Doc](https://pqina.nl/filepond/docs/) on what each property does.

The way that `FieldImageInput` works is that it maintains an array of images to be uploaded and images to be remove (as in the case of editing a product).
Newly added images are stored as `File` instances.
Images that have already been uploaded will be loaded into the `state.files` in the constructor of the component and are not of `File` instances .

Whenever an user adds a new file, `onupdatefiles` sets all images (whether they are newly added images, or images that had already been uploaded) into the `state.files`.
The function then checks for newly added images by filtering out image data in `state.files` that are not of `File` instances, append those into the `files.toBeAdded` array.

For removal of images, `onremovefile` differentiates between images that were already uploaded and newly added images by checking if the `file.constructor` is `Blob`.
A positive comparison indicates that the image to be removed belongs to the former category, and the function pushes the image data into the `files.toBeRemoved` array.

Image data of `File` instances will be further processed by the `productFormSubmit` saga, which retrieves the Base-64 string of each image.
GraphQL mutation for image upload takes the Base-64 string of each image, and recreates the image file in our S3 server.
The S3 bucket that these images sit in is `https://s3.amazonaws.com/gastrograph-console-images/`

For removal of images however, the actual image files are not removed from our S3 server.
What the GraphQL mutation does is it simply dissociates the said images to the product.
This is not a concern now, but it's something worth considering in the future when having thousands of redundant images sitting in our server taking up precious memory storage does not really make sense.

Note that for some reason, existing images do not load into FilePond when an user chooses to edit a product.
This has something to do with CORS policy that has to be fixed on AWS.
