import { Locator, Page } from '@playwright/test'

export class IssueDetailsPage {
    page: Page
    title: Locator
    status: Locator
    issueNumber: Locator
    closeBtn: Locator
    constructor(page: Page) {
        this.page = page
        this.title = this.page.getByTestId('issue-title')
        this.status = this.page.getByTestId('issue-metadata-fixed').getByTestId('header-state')
        this.issueNumber = this.page.locator('div[data-component="TitleArea"] span')
        this.closeBtn = this.page.getByText('Close Issue')
    }
    async getIssueNumber(): Promise<number> {
        const issueNb = await this.issueNumber.innerText()
        return parseInt(issueNb.replace('#',''))
    }
}