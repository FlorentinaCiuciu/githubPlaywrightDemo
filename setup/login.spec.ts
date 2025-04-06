import { expect } from '@playwright/test'
import { LoginPage } from '../libs/pages/login.page'
import { test } from './base.fixture'
import { STORAGE_STATE } from '../playwright.config'

test('Login to github', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await page.goto('/')
    await loginPage.loginWithUser(process.env.GITHUB_USER, process.env.GITHUB_PASSWORD)
    expect(await loginPage.headerTitle.innerText()).toBe('Dashboard')

    await page.context().storageState({ path: STORAGE_STATE})
})