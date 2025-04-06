import { Locator, Page } from '@playwright/test'
import { IssueDetailsPage } from './issue-details.page'

export class IssueCreatePage {
    page: Page
    titleInput: Locator
    bodyInput: Locator
    createBtn: Locator
    titleValidation: Locator
    constructor(page: Page) {
        this.page = page
        this.titleInput = this.page.getByPlaceholder('Title')
        this.bodyInput = this.page.getByPlaceholder('Type your description here…')
        this.createBtn = this.page.getByTestId('create-issue-button')
        this.titleValidation = this.page.locator('#title-validation')
    }
    async createIssue(issueDetails): Promise<IssueDetailsPage> {
        if(issueDetails.title) {
            await this.titleInput.fill(issueDetails.title)
        }
        if(issueDetails.body) {
            await this.bodyInput.fill(issueDetails.body)
        }
        await this.createBtn.click()
        // TODO: wait for some explicit event to ensure issue is created otherwise won't be displayed in issues list
        await this.page.waitForTimeout(3000)
        return new IssueDetailsPage(this.page)
    }
}