import { z } from 'zod';

export const passportLookupSchema = z.object({
  serialNumber: z
    .string()
    .min(5, 'Serial number must be at least 5 characters')
    .regex(/^[A-Z0-9-]+$/i, 'Invalid serial format (e.g. SPFY-2026-APEX-008492)'),
});

export const tradeInRequestSchema = z.object({
  serialNumber: z.string().min(5),
  email: z.string().email(),
  declaredCondition: z.enum(['MINT', 'EXCELLENT', 'GOOD', 'END_OF_LIFE']),
  notes: z.string().optional(),
});

export type TradeInRequestInput = z.infer<typeof tradeInRequestSchema>;
