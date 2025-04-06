import  base  from '@playwright/test'
import { IssuesEndpoint } from '../libs/apis/issues.api'
import { IssuesPage } from '../libs/pages/issues.page'
type customFixtures = {
issuesApi: IssuesEndpoint,
issuesPage: IssuesPage
}
const test = base.extend<customFixtures>({
issuesApi: async({playwright}, use) => {
    const apiRequest = await playwright.request.newContext({
        extraHTTPHeaders: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
       })
    const issues = new IssuesEndpoint(apiRequest)  
    await use(issues)
},
issuesPage: async({page}, use) => {
    const issuesPage = new IssuesPage(page)
    await issuesPage.goToIssues()
    
    await use(issuesPage)
},
})

export { test }
