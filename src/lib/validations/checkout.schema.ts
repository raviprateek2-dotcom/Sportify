import { z } from 'zod';

export const checkoutItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().length(2, 'Two-letter ISO country code required').default('US'),
  paymentMethod: z.enum(['CARD', 'KLARNA', 'PAYPAL', 'APPLE_PAY']).default('CARD'),
  items: z.array(checkoutItemSchema).min(1, 'Cart cannot be empty'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
