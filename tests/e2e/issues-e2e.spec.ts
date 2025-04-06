import { expect } from '@playwright/test';
import { test } from '../../setup/base.fixture'
import { randomNumber } from '../../utils'
import { IssueCreatePage } from '../../libs/pages/issue-create.page';
import { IssueDetailsPage } from '../../libs/pages/issue-details.page';

test.describe('Issue creation and update', async () => {
  let issueData: { title: string, body: string }, issueDetailsPage: IssueDetailsPage , issueCreatePage: IssueCreatePage
  test.beforeEach(async({issuesPage}) => {  
    issueData = {
      title: `Found a bug - ${randomNumber()}`,
      body: 'This is the issue body.',
    }
    // Create a new issue
     issueCreatePage = await issuesPage.openCreateIssuePage()
     issueDetailsPage = await issueCreatePage.createIssue(issueData)
    })
   
  test('E2E - Validate issue creation', async ({ issuesPage}) => {
    await expect(issueCreatePage.createBtn).toBeVisible({ visible: false})
    // Verify issue was created
    expect(await issueDetailsPage.title.innerText()).toBe(issueData.title)
    expect(await issueDetailsPage.status.innerText()).toBe('Open')
  
    await issuesPage.goToIssues()
    // Verify issue appears in Issues List
  expect(issuesPage.issueWithTitle(issueData.title)).toBeVisible()
  })

  test('E2E - Validate issue state update', async ({ issuesPage, issuesApi }) => {
    await issuesPage.goToIssues()
    // Open issue and change state to Close
    issueDetailsPage = await issuesPage.openIssueDetails(issueData.title)
    await issueDetailsPage.closeBtn.click()

    // Verify issue was Closed
    expect(await issueDetailsPage.title.innerText()).toBe(issueData.title)
    expect(await issueDetailsPage.status.innerText()).toBe('Closed')
    const issueId = await issueDetailsPage.getIssueNumber()

    const issueDetailsResponse = await issuesApi.getIssueDetails(issueId)
    // Validate via API the status was updated
    expect(issueDetailsResponse.status).toBe(200)
    expect(issueDetailsResponse.json.state).toEqual('closed')

  })
})
test('E2E - Validate issue creation without title', async({ issuesPage, issuesApi }) => {
  const issueCreatePage = await issuesPage.openCreateIssuePage()
  await issueCreatePage.createIssue({ body: 'issue description'})
  
  // Verify title validation is displayed and has the right text
  await expect(issueCreatePage.createBtn).toBeVisible()
  expect(await issueCreatePage.titleValidation.innerText()).toBe('Title can not be empty')
})