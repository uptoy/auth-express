import Joi from 'joi'
import { registrationSchema,loginSchema,forgotPasswordSchema } from '../auth.schema'

describe('Validation Schemas', () => {
  describe('registrationSchema', () => {
    it('should validate a valid registration data', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123'
      }
      const { error } = registrationSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should return an error if name is missing', () => {
      const data = {
        email: 'john.doe@example.com',
        password: 'securePassword123'
      }
      const { error } = registrationSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"name" is required/)
    })

    it('should return an error if email is invalid', () => {
      const data = {
        name: 'John Doe',
        email: 'john.doe@example',
        password: 'securePassword123'
      }
      const { error } = registrationSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"email" must be a valid email/)
    })
  })

  describe('loginSchema', () => {
    it('should validate a valid login data', () => {
      const data = {
        email: 'john.doe@example.com',
        password: 'securePassword123'
      }
      const { error } = loginSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should return an error if email is missing', () => {
      const data = {
        password: 'securePassword123'
      }
      const { error } = loginSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"email" is required/)
    })

    it('should return an error if password is missing', () => {
      const data = {
        email: 'john.doe@example.com'
      }
      const { error } = loginSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"password" is required/)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate a valid forgot password data', () => {
      const data = {
        email: 'john.doe@example.com'
      }
      const { error } = forgotPasswordSchema.validate(data)
      expect(error).toBeUndefined()
    })

    it('should return an error if email is missing', () => {
      const data = {}
      const { error } = forgotPasswordSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"email" is required/)
    })

    it('should return an error if email is invalid', () => {
      const data = {
        email: 'john.doe@example'
      }
      const { error } = forgotPasswordSchema.validate(data)
      expect(error?.details[0].message).toMatch(/"email" must be a valid email/)
    })
  })
})

