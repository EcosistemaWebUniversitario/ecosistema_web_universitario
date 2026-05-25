import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string; // UUID from Supabase
    email: string;
  };
}
