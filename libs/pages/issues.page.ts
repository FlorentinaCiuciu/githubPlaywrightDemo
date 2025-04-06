import { Locator, Page, expect } from '@playwright/test'
import { BASE_URL } from '../../playwright.config'
import { IssueDetailsPage } from './issue-details.page'
import { IssueCreatePage } from './issue-create.page'

export class IssuesPage {
    page: Page
    newIssueBtn: Locator
    issueWithTitle: (title: string) => Locator
    constructor(page: Page) {
        this.page = page
        this.newIssueBtn = this.page.getByText('New issue')
        this.issueWithTitle = (title: string) => page.getByText(title)
    }
    
    async goToIssues(): Promise<void> {
        await this.page.goto(`${BASE_URL}/issues`)
    }

    async openCreateIssuePage(): Promise<IssueCreatePage> {
        await this.newIssueBtn.click()
        return new IssueCreatePage(this.page)
    }

    async openIssueDetails(issueTitle: string): Promise<IssueDetailsPage> {
       const issue = this.issueWithTitle(issueTitle)
       expect(issue).toBeVisible()
       await issue.click()
       
       return new IssueDetailsPage(this.page)

    }
}