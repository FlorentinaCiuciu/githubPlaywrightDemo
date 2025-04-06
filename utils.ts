import { APIResponse } from "@playwright/test"
import Ajv from 'ajv'

export const randomNumber = (max: number = 10000000): number => Math.floor(Math.random() * max)

export const parseApiResponse = async (response: APIResponse) =>  { return { status: response.status(), json: await response.json() }}

// API response schema validator
export const validateSchema = (schema, body) =>  {
    const ajv = new Ajv({strictTuples: true})
    const validate = ajv.compile(schema)
    const valid = validate(body)
    const { errors } = validate
    return { valid, errors }
  }