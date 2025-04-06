import { test } from '../../setup/base.fixture'
import { expect } from '@playwright/test'
import { randomNumber, validateSchema } from '../../utils'
import  issuesListSchema  from '../../test-data/api-schemas/issues-list.json'
import  issueCreatedSchema  from '../../test-data/api-schemas/issue-create.json'
import issueDetailsSchema from '../../test-data/api-schemas/issue-details.json'
import issueUpdatedSchema from '../../test-data/api-schemas/issue-update.json'

test.describe('Issue creation and update', async () => {
  let newIssueId: number
  let createResponse: { status, json }
  let newIssueBody: { title: string, body: string }
  test.beforeEach(async({issuesApi}) => {  
    newIssueBody = {
      title: `Found a bug - ${randomNumber()}`,
      body: 'This is the issue body.',
    }
    // Create a new issue
    createResponse = await issuesApi.createIssue(newIssueBody)
    newIssueId = createResponse.json.number
    console.log('Created issue id:', newIssueId)
  })
  test('API - Validate issue creation', async ({ issuesApi }) => {
    // Validate api response status and body
    expect(createResponse.status).toBe(201)
    expect(validateSchema(issueCreatedSchema, createResponse.json).valid).toBe(true)

    // Get issue details
    const issueDetailsResponse = await issuesApi.getIssueDetails(newIssueId)
    // Validate api response status and body
    expect(issueDetailsResponse.status).toBe(200)
    expect(validateSchema(issueDetailsSchema, issueDetailsResponse.json).valid).toBe(true)
    
    // Validate issue was created with right title and body
    expect(issueDetailsResponse.json.title).toEqual(newIssueBody.title)
    expect(issueDetailsResponse.json.body).toEqual(newIssueBody.body)

  })
  test('API - Validate issue state update', async ({ issuesApi }) => {
    // Update issue to state = closed
    const updateResponse = await issuesApi.updateIssue(newIssueId, { state: 'closed'})
    
    // Validate api response status and body
    expect(updateResponse.status).toBe(200)
    expect(validateSchema(issueUpdatedSchema, updateResponse.json).valid).toBe(true)
    expect(updateResponse.json.state).toEqual('closed')

    // Get issue details
    const issueDetailsResponse = await issuesApi.getIssueDetails(newIssueId)
    // Validate status was updated
    expect(issueDetailsResponse.status).toBe(200)
    expect(issueDetailsResponse.json.state).toEqual('closed')
  })
})

test('API - Validate issue list endpoint', async({issuesApi}) => {
// Get all issues
const issuesListResponse = await issuesApi.getIssuesList()
console.log('Issues list number: ', issuesListResponse.json.length)
// Validate api response status and body
expect(issuesListResponse.status).toBe(200)
expect(validateSchema(issuesListSchema, issuesListResponse.json).valid).toBe(true)
// TODO: maybe validate something in the list - number of items, properties, etc.
})

// Note: this list is not exhaustive, it's just an example on how negative cases can be tested
const testCases = [
  { usecase: 'Missing required title',
    testData: { body: 'test'},
    expectedStatus: 422,
    expectedMessage: 'Invalid request.\n\n"title" wasn\'t supplied.'
 },
 {  usecase: 'Invalid assignee in payload',
    testData: {
      "title": "Found a bug",
      "assignees": 123
  },
    expectedStatus: 422,
    expectedMessage: 'Invalid request.\n\nFor \'properties/assignees\', 123 is not an array.'
}]
testCases.forEach(({usecase, testData, expectedStatus, expectedMessage}) => {
  test(`API - Issue creation payload validations - ${usecase}`, async({issuesApi}) => {
    const createResponse = await issuesApi.createIssue(testData)
    expect(createResponse.status).toBe(expectedStatus)
    expect(createResponse.json.message).toBe(expectedMessage)
  })
})

test(`API - Issue creation - invalid endpoint path`, async({issuesApi}) => {
  issuesApi.endpointPath +='/test'
  const createResponse = await issuesApi.createIssue({title: 'test test'})
  expect(createResponse.status).toBe(404)
  expect(createResponse.json.message).toBe('Not Found')
})