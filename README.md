# E2E and API testing using Github Rest Api and Playwright

### How to run tests:
In a terminal run the following commands:
1. Clone the repository locally: 
```bash 
$ git clone <path>
```
2. Move to the repository folder and install dependencies: 
```bash
   $ cd <path_to_repo>
   $ npm install
   $ npx playwright install
```
4. In config folder, edit **.env** file with environment variables:
```bash
GITHUB_TOKEN = '<github access token>'
OWNER = '<github repository owner>'
REPO_NAME = '<github repository name>'

GITHUB_USER = '<github username>'
GITHUB_PASSWORD = '<github password>'
```
3. Execute desired suite defined in package.json scripts:
```bash
// run all API tests
$ npm run tests:api 

// run all E2E tests
$ npm run tests:e2e 
```
### Framework structure:
- **config**: folder for environment variables and other configuration files
- **setup**: folder for custom fixtures and setup script - these are used for all tests prerequisites
- **libs**: framework page objects and apis endpoint mappings
- **test-data**: folder for test data files - example: API schema validation files
- **tests**: folder containing all framework tests; organized based on the test category: API or UI E2E

In **playwright.config.ts** there are 3 projects configured:
-  each runs it's specific set of tests using testMatch filtering
-  each has it's specific baseUrl and prerequisite('setup' project) based on what kind of tests are executed
- projects:     
    - **setup**: it is used only as a prerequisite for E2e tests: the github login is performed once per test suite execution and storage state it is saved and reused for all tests
    - **e2e**: project configuration for all UI E2E tests
    - **api**: project configuration for all API tests

