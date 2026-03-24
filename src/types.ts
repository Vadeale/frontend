export type JobCategory =
  | 'all'
  | 'video'
  | 'design'
  | 'marketing'
  | 'chats'
  | 'sites'
  | 'social'
  | 'support'
  | 'other';

export interface Job {
  token: string;
  text: string;
  category: Exclude<JobCategory, 'all'>;
  public_contacts: string;
  email?: string;
  employer_email?: string;
  created_at: number;
  image?: string | null;
  responses?: number;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  total: number;
  jobs: Job[];
}
