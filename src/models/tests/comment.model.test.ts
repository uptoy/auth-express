// Import any necessary modules or libraries
import { Comment } from '../../src/models/comment.model'

// Sample data for testing
const sampleComment: Comment = {
  id: 1,
  content: 'This is a test comment.',
  author_id: 101,
  post_id: 202,
  created_at: new Date('2024-01-01T12:00:00Z'),
  updated_at: new Date('2024-01-02T12:00:00Z')
}

// Test suite
describe('Comment Interface', () => {
  it('should have the correct properties and types', () => {
    // Check if sampleComment has all required properties
    expect(sampleComment).toHaveProperty('id')
    expect(sampleComment).toHaveProperty('content')
    expect(sampleComment).toHaveProperty('author_id')
    expect(sampleComment).toHaveProperty('post_id')
    expect(sampleComment).toHaveProperty('created_at')
    expect(sampleComment).toHaveProperty('updated_at')

    // Check types of each property
    expect(typeof sampleComment.id).toBe('number')
    expect(typeof sampleComment.content).toBe('string')
    expect(typeof sampleComment.author_id).toBe('number')
    expect(typeof sampleComment.post_id).toBe('number')
    expect(sampleComment.created_at instanceof Date).toBe(true)
    expect(sampleComment.updated_at instanceof Date).toBe(true)
  })

  it('should allow updating content', () => {
    sampleComment.content = 'Updated content.'
    expect(sampleComment.content).toBe('Updated content.')
  })
})
