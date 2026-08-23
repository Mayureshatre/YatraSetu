export type PostCategory =
  | 'Question'
  | 'Travel Experience'
  | 'Recommendation'
  | 'Road Condition'
  | 'Safety'
  | 'Accommodation'
  | 'Food'
  | 'Hidden Gem'
  | 'Itinerary'
  | 'Photography'
  | 'General Discussion';

export const POST_CATEGORIES: PostCategory[] = [
  'General Discussion',
  'Question',
  'Travel Experience',
  'Recommendation',
  'Road Condition',
  'Safety',
  'Hidden Gem',
  'Itinerary',
  'Food',
  'Accommodation',
  'Photography',
];

export interface RatingCategories {
  cleanliness: number;     // 1 to 5
  safety: number;          // 1 to 5
  accessibility: number;   // 1 to 5
  scenery: number;         // 1 to 5
  family_friendly: number; // 1 to 5
  value_for_money: number; // 1 to 5
}

export interface DestinationReview {
  id: string;
  destination_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string | null;
  overall_score: number;
  category_scores: Partial<RatingCategories>;
  body?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface PostImage {
  id: string;
  post_id: string;
  storage_path: string;
  mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
  size_bytes: number;
  created_at?: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  parent_id?: string | null;
  user_id: string;
  user_name?: string;
  user_avatar?: string | null;
  body: string;
  upvotes?: number;
  user_has_upvoted?: boolean;
  replies?: PostComment[];
  created_at: string;
}

export interface PostVote {
  id: string;
  post_id: string;
  user_id: string;
  vote_type: 1 | -1;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  destination_id: string;
  destination_name?: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string | null;
  title: string;
  body: string;
  category: PostCategory;
  upvotes_count: number;
  downvotes_count: number;
  net_votes: number;
  user_vote?: 1 | -1 | null;
  popularity_score: number;
  images?: PostImage[];
  comments_count?: number;
  comments?: PostComment[];
  created_at: string;
  updated_at?: string;
}

export interface PostReport {
  id: string;
  reporter_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}
