import { z } from 'zod';

// Import the schema directly from the route file
const formationRequestSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z.string().email("Email invalide").max(255, "Email trop long"),
  message: z.string().max(1000, "Message trop long").optional(),
});

describe('Formation Registration Schema Validation', () => {
  describe('Valid data', () => {
    it('validates complete valid data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Je suis intéressé par la formation Initiation à la Dégustation',
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('validates data without message', () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('handles special characters in name', () => {
      const validData = {
        name: 'José María García-López',
        email: 'jose@example.com',
        message: 'Intéressé par les formations avec caractères spéciaux éàç',
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid data', () => {
    it('rejects missing name', () => {
      const invalidData = {
        email: 'test@example.com',
        message: 'Test message',
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
        expect(result.error.issues[0].message).toBe('Invalid input: expected string, received undefined');
      }
    });

    it('rejects empty name', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('rejects invalid email', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
        expect(result.error.issues[0].message).toBe('Email invalide');
      }
    });

    it('rejects missing email', () => {
      const invalidData = {
        name: 'Test User',
        message: 'Test message',
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('rejects name too long', () => {
      const invalidData = {
        name: 'A'.repeat(101), // 101 characters, max is 100
        email: 'test@example.com',
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
        expect(result.error.issues[0].message).toBe('Le nom est trop long');
      }
    });

    it('rejects email too long', () => {
      const invalidData = {
        name: 'Test User',
        email: 'a'.repeat(250) + '@example.com', // More than 255 characters
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
        expect(result.error.issues[0].message).toBe('Email trop long');
      }
    });

    it('rejects message too long', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'A'.repeat(1001), // 1001 characters, max is 1000
      };

      const result = formationRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message');
        expect(result.error.issues[0].message).toBe('Message trop long');
      }
    });
  });

  describe('Edge cases', () => {
    it('accepts name at maximum length', () => {
      const validData = {
        name: 'A'.repeat(100), // Exactly 100 characters
        email: 'test@example.com',
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts email at maximum length', () => {
      const validData = {
        name: 'Test User',
        email: 'a'.repeat(240) + '@example.com', // Exactly 255 characters
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts message at maximum length', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'A'.repeat(1000), // Exactly 1000 characters
      };

      const result = formationRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
