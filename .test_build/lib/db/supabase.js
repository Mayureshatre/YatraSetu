"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supabaseAdmin = exports.supabase = exports.db = exports.SEED_DESTINATIONS = void 0;
var _supabaseJs = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? (0, _supabaseJs.createClient)(supabaseUrl, supabaseAnonKey) : null;
exports.supabase = supabase;
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? (0, _supabaseJs.createClient)(supabaseUrl, supabaseServiceKey) : null;

// Canonical Seed Data for Fallback / Local / Test Mode
exports.supabaseAdmin = supabaseAdmin;
const SEED_DESTINATIONS = [{
  id: 'a1111111-1111-1111-1111-111111111111',
  name: 'Pachmarhi (Queen of Satpura)',
  slug: 'pachmarhi',
  description: 'A pristine hill station nestled in the Satpura range, famed for waterfalls, prehistoric cave paintings, viewpoints, and tranquil pine forests.',
  latitude: 22.4674,
  longitude: 78.4346,
  category: 'Hill Station & Nature',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Scenic ghat roads from Pipariya; well-maintained asphalt with hairpin turns. Caution advised during heavy monsoons.',
  safety_tips: ['Maintain low gears on ghat descents', 'Forest entry permit required for core reserve zones', 'Pre-book forest gypsy safari for Bee Falls']
}, {
  id: 'b2222222-2222-2222-2222-222222222222',
  name: 'Khajuraho Group of Monuments',
  slug: 'khajuraho',
  description: 'A world-renowned UNESCO World Heritage site known for magnificent Nagara-style architectural temples and intricate stone sculptures.',
  latitude: 24.8318,
  longitude: 79.9199,
  category: 'Heritage & Architecture',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'NH 39 four-lane highway connectivity from Jhansi and Chhatarpur; smooth transit suitable for all vehicles.',
  safety_tips: ['Western group of temples requires ASI entry ticket', 'Light and Sound show operates in evening hours', 'Summer temperatures can exceed 42C; carry hydration']
}, {
  id: 'c3333333-3333-3333-3333-333333333333',
  name: 'Sanchi Stupa & Archaeological Complex',
  slug: 'sanchi',
  description: 'One of India’s oldest stone structures commissioned by Emperor Ashoka in the 3rd century BCE, representing timeless Buddhist art and monastic legacy.',
  latitude: 23.4800,
  longitude: 77.7400,
  category: 'UNESCO Heritage & History',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Direct 4-lane SH 19 / NH 146 highway from Bhopal (approx 46 km); excellent dual carriageway.',
  safety_tips: ['Electric golf carts available for elderly visitors', 'ASI museum is closed on Fridays', 'Ideal for morning visits to avoid midday sun']
}, {
  id: 'd4444444-4444-4444-4444-444444444444',
  name: 'Mandu (City of Joy)',
  slug: 'mandu',
  description: 'A ruined medieval fortress city celebrated for Afghan architecture, Jahaz Mahal, Rani Roopmati Pavilion, and baobab trees perched on the Vindhya range.',
  latitude: 22.3660,
  longitude: 75.3430,
  category: 'Historical Citadel & Romantic Heritage',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Approached via Dhar/Indore through smooth state highways with scenic plateau winding roads.',
  safety_tips: ['Bicycle rentals available at monument gates', 'Monsoon season (July-Sept) offers peak greenery', 'Watch for steep staircases in ancient palaces']
}, {
  id: 'e5555555-5555-5555-5555-555555555555',
  name: 'Bhedaghat & Marble Rocks',
  slug: 'bhedaghat',
  description: 'Towering marble cliffs rising 100 feet on either side of the sacred Narmada River, creating the roaring Dhuandhar Falls and serene boat gorge.',
  latitude: 23.1311,
  longitude: 79.8006,
  category: 'Geological Wonder & River Gorge',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Fast 22 km highway drive from Jabalpur city center; broad bypass road with smooth tarmac.',
  safety_tips: ['Boating is suspended during peak flood season', 'Full moon night boating is exceptionally popular', 'Ropeway available over Dhuandhar falls']
}, {
  id: 'f6666666-6666-6666-6666-666666666666',
  name: 'Orchha Historic Royal Town',
  slug: 'orchha',
  description: 'A frozen-in-time riverside kingdom founded in the 16th century, featuring the grand Jahangir Mahal, Ram Raja Temple, and towering royal cenotaphs.',
  latitude: 25.3510,
  longitude: 78.6433,
  category: 'Palatial Heritage & Riverside Culture',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Easy 15 km drive from Jhansi railway hub; wide paved road connecting across the Betwa river.',
  safety_tips: ['River rafting available on the Betwa in post-monsoon', 'Ram Raja Temple follows royal guard salute timings', 'Sound and light show in Hindi and English']
}, {
  id: '77777777-7777-7777-7777-777777777777',
  name: 'Kanha National Park',
  slug: 'kanha',
  description: 'Vast Sal forests and grasslands that inspired Rudyard Kipling’s Jungle Book, hosting healthy populations of Royal Bengal Tigers and Barasingha.',
  latitude: 22.3345,
  longitude: 80.6115,
  category: 'Wildlife Safari & Tiger Reserve',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Good state highway from Jabalpur and Raipur; forest fringe roads require slow cautious driving.',
  safety_tips: ['Park closed July 1 to Sept 30 during breeding season', 'Safari slots must be reserved weeks in advance', 'Morning safaris require early 5:30 AM reporting']
}, {
  id: '88888888-8888-8888-8888-888888888888',
  name: 'Bhimbetka Rock Shelters',
  slug: 'bhimbetka',
  description: 'An extraordinary UNESCO site displaying human rock paintings over 30,000 years old depicting prehistoric dance, hunting, and daily life.',
  latitude: 22.9372,
  longitude: 77.6128,
  category: 'Prehistoric Archaeology & Caves',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Directly off NH 46 (Bhopal-Hoshangabad highway) approx 45 km; quick turnoff with paved access road.',
  safety_tips: ['Short 1.5 km walking trail across rock clusters', 'Guide audio devices available at entry kiosk', 'Bring comfortable footwear for rock terrain']
}, {
  id: '99999999-9999-9999-9999-999999999999',
  name: 'Ujjain Mahakal & Sacred Ghats',
  slug: 'ujjain',
  description: 'One of the seven sacred Moksha puris in India, home to the revered Mahakaleshwar Jyotirlinga, the Shri Mahakal Mahalok corridor, and Ram Ghat on the Shipra.',
  latitude: 23.1765,
  longitude: 75.7885,
  category: 'Pilgrimage & Spiritual Culture',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80',
  road_condition: 'Indore-Ujjain 4-lane expressway (SH 27); high capacity transit with multiple rest plazas.',
  safety_tips: ['Bhasma Aarti pre-booking required on official shrine portal', 'Battery e-rickshaws operate throughout Mahakal corridor', 'Ghat evening aarti begins around sunset']
}, {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Maheshwar Holy Ghats & Ahilya Palace',
  slug: 'maheshwar',
  description: 'A tranquil spiritual town on the banks of the Narmada, renowned for Ahilya Bai Holkar’s fortified palace, handloom Maheshwari sarees, and riverside temples.',
  latitude: 22.1790,
  longitude: 75.5840,
  category: 'Culture, Weaving Heritage & Spiritual',
  region: 'Madhya Pradesh',
  hero_image_url: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=1200&q=80',
  road_condition: '90 km from Indore via AB Road and Dhamnod bypass; smooth rural expressway.',
  safety_tips: ['Visit Rehwa Society inside fort for live handloom weaving', 'Sunset boat ride to Baneshwar temple recommended', 'Quiet peaceful ghat walks in the morning']
}];

// In-Memory Database Store for State & Reviews / Posts
exports.SEED_DESTINATIONS = SEED_DESTINATIONS;
class MemoryDatabase {
  destinations = [...SEED_DESTINATIONS];
  reviews = [{
    id: 'rev-001',
    destination_id: 'a1111111-1111-1111-1111-111111111111',
    user_id: 'user-001',
    user_name: 'Ananya Sharma',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    overall_score: 4.8,
    category_scores: {
      cleanliness: 5,
      safety: 5,
      accessibility: 4,
      scenery: 5,
      family_friendly: 5,
      value_for_money: 5
    },
    body: 'Pachmarhi was breathtaking in August! The waterfalls had full flow and the weather was delightfully misty. Drive from Pipariya was very smooth.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }, {
    id: 'rev-002',
    destination_id: 'c3333333-3333-3333-3333-333333333333',
    user_id: 'user-002',
    user_name: 'Rahul Verma',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    overall_score: 4.7,
    category_scores: {
      cleanliness: 5,
      safety: 5,
      accessibility: 5,
      scenery: 4,
      family_friendly: 4,
      value_for_money: 5
    },
    body: 'Incredible historical aura. The ASI campus is impeccably maintained. Very quick 45-minute drive from Bhopal.',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }];
  posts = [{
    id: 'post-001',
    destination_id: 'a1111111-1111-1111-1111-111111111111',
    destination_name: 'Pachmarhi (Queen of Satpura)',
    user_id: 'user-001',
    user_name: 'Vikram Joshi',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    title: 'Top tips for Bee Falls & Dhoopgarh Sunset',
    body: 'If you are visiting Pachmarhi by car, make sure to park near the forest barrier and hire the local 4x4 for Bee Falls trail. Dhoopgarh sunset view is unforgettable—reach before 5:15 PM for good spots!',
    popularity_score: 42,
    images: [{
      id: 'img-001',
      post_id: 'post-001',
      storage_path: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      mime_type: 'image/jpeg',
      size_bytes: 1240000
    }],
    comments_count: 2,
    comments: [{
      id: 'com-001',
      post_id: 'post-001',
      user_id: 'user-003',
      user_name: 'Priya Mehta',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      body: 'Thanks Vikram! Are private 2-wheelers allowed all the way to Dhoopgarh?',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    }, {
      id: 'com-002',
      post_id: 'post-001',
      user_id: 'user-001',
      user_name: 'Vikram Joshi',
      body: 'Yes, bikes are permitted with an eco-toll token at the forest checkpost.',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    }],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }, {
    id: 'post-002',
    destination_id: 'c3333333-3333-3333-3333-333333333333',
    destination_name: 'Sanchi Stupa & Archaeological Complex',
    user_id: 'user-004',
    user_name: 'Neha Kapoor',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    title: 'Morning cycling trip from Bhopal to Sanchi',
    body: 'Did a 48 km cycling loop along the scenic state highway. The road shoulder is wide, and reaching the Stupa at 7:30 AM before tourists arrive is pure bliss.',
    popularity_score: 29,
    images: [{
      id: 'img-002',
      post_id: 'post-002',
      storage_path: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      mime_type: 'image/jpeg',
      size_bytes: 980000
    }],
    comments_count: 1,
    comments: [{
      id: 'com-003',
      post_id: 'post-002',
      user_id: 'user-005',
      user_name: 'Aditya Sen',
      body: 'Great route! Did you stop at Tropic of Cancer marker along the way?',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }];
  itineraries = new Map();
  trips = new Map();
  async getDestinations() {
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('destinations').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return this.destinations;
  }
  async getDestinationById(id) {
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('destinations').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return this.destinations.find(d => d.id === id || d.slug === id) || null;
  }
  async getReviews(destinationId) {
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('reviews').select(`*, profiles(display_name, avatar_url)`).eq('destination_id', destinationId).order('created_at', {
        ascending: false
      });
      if (!error && data) {
        return data.map(r => ({
          ...r,
          user_name: r.profiles?.display_name || 'Traveler',
          user_avatar: r.profiles?.avatar_url || null
        }));
      }
    }
    return this.reviews.filter(r => r.destination_id === destinationId);
  }
  async getReviewById(id) {
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('reviews').select(`*, profiles(display_name, avatar_url)`).eq('id', id).single();
      if (!error && data) {
        return {
          ...data,
          user_name: data.profiles?.display_name || 'Traveler',
          user_avatar: data.profiles?.avatar_url || null
        };
      }
    }
    return this.reviews.find(r => r.id === id) || null;
  }
  async createReview(review) {
    const newReview = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('reviews').insert({
        destination_id: review.destination_id,
        user_id: review.user_id,
        overall_score: review.overall_score,
        category_scores: review.category_scores,
        body: review.body
      }).select().single();
      if (!error && data) return {
        ...data,
        user_name: review.user_name
      };
    }
    this.reviews.unshift(newReview);
    return newReview;
  }
  async updateReview(reviewId, userId, updates) {
    const existing = await this.getReviewById(reviewId);
    if (!existing) {
      return {
        success: false,
        error: `Review '${reviewId}' not found`,
        status: 404
      };
    }
    if (existing.user_id !== userId) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to modify this review',
        status: 403
      };
    }
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('reviews').update({
        overall_score: updated.overall_score,
        category_scores: updated.category_scores,
        body: updated.body,
        updated_at: updated.updated_at
      }).eq('id', reviewId).eq('user_id', userId).select().single();
      if (!error && data) return {
        success: true,
        review: {
          ...data,
          user_name: existing.user_name
        },
        status: 200
      };
    }
    const index = this.reviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.reviews[index] = updated;
    }
    return {
      success: true,
      review: updated,
      status: 200
    };
  }
  async deleteReview(reviewId, userId) {
    const existing = await this.getReviewById(reviewId);
    if (!existing) {
      return {
        success: false,
        error: `Review '${reviewId}' not found`,
        status: 404
      };
    }
    if (existing.user_id !== userId) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete this review',
        status: 403
      };
    }
    if (supabase) {
      const {
        error
      } = await supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', userId);
      if (!error) return {
        success: true,
        status: 200
      };
    }
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    return {
      success: true,
      status: 200
    };
  }
  async getCommunityPosts(destinationId) {
    if (supabase) {
      let query = supabase.from('community_posts').select(`*, profiles(display_name, avatar_url), post_images(*), post_comments(*, profiles(display_name, avatar_url))`).order('popularity_score', {
        ascending: false
      });
      if (destinationId) {
        query = query.eq('destination_id', destinationId);
      }
      const {
        data,
        error
      } = await query;
      if (!error && data) {
        return data.map(p => ({
          id: p.id,
          destination_id: p.destination_id,
          user_id: p.user_id,
          user_name: p.profiles?.display_name || 'Traveler',
          user_avatar: p.profiles?.avatar_url || null,
          title: p.title,
          body: p.body,
          popularity_score: p.popularity_score,
          images: p.post_images || [],
          comments_count: (p.post_comments || []).length,
          comments: (p.post_comments || []).map(c => ({
            id: c.id,
            post_id: c.post_id,
            user_id: c.user_id,
            user_name: c.profiles?.display_name || 'Traveler',
            user_avatar: c.profiles?.avatar_url || null,
            body: c.body,
            created_at: c.created_at
          })),
          created_at: p.created_at
        }));
      }
    }
    if (destinationId) {
      return this.posts.filter(p => p.destination_id === destinationId).sort((a, b) => b.popularity_score - a.popularity_score);
    }
    return [...this.posts].sort((a, b) => b.popularity_score - a.popularity_score);
  }
  async getPostById(postId) {
    const posts = await this.getCommunityPosts();
    return posts.find(p => p.id === postId) || null;
  }
  async createCommunityPost(post) {
    const destination = await this.getDestinationById(post.destination_id);
    const newPostId = `post-${Date.now()}`;
    const newPost = {
      ...post,
      id: newPostId,
      destination_name: destination?.name || 'Destination',
      popularity_score: 1,
      images: post.image_url ? [{
        id: `img-${Date.now()}`,
        post_id: newPostId,
        storage_path: post.image_url,
        mime_type: 'image/jpeg',
        size_bytes: 500000
      }] : [],
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString()
    };
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('community_posts').insert({
        destination_id: post.destination_id,
        user_id: post.user_id,
        title: post.title,
        body: post.body,
        popularity_score: 1
      }).select().single();
      if (!error && data) return {
        ...data,
        images: newPost.images,
        comments: []
      };
    }
    this.posts.unshift(newPost);
    return newPost;
  }
  async deletePost(postId, userId) {
    const post = await this.getPostById(postId);
    if (!post) {
      return {
        success: false,
        error: `Post '${postId}' not found`,
        status: 404
      };
    }
    if (post.user_id !== userId) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete this post',
        status: 403
      };
    }
    if (supabase) {
      const {
        error
      } = await supabase.from('community_posts').delete().eq('id', postId).eq('user_id', userId);
      if (!error) return {
        success: true,
        status: 200
      };
    }
    this.posts = this.posts.filter(p => p.id !== postId);
    return {
      success: true,
      status: 200
    };
  }
  async addComment(postId, userId, userName, body) {
    const comment = {
      id: `com-${Date.now()}`,
      post_id: postId,
      user_id: userId,
      user_name: userName,
      body,
      created_at: new Date().toISOString()
    };
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push(comment);
      post.comments_count = post.comments.length;
      post.popularity_score += 2; // Increase popularity on engagement
    }

    return comment;
  }
  async deleteComment(commentId, userId) {
    let foundComment = null;
    let targetPost = null;
    for (const post of this.posts) {
      const c = post.comments?.find(item => item.id === commentId);
      if (c) {
        foundComment = c;
        targetPost = post;
        break;
      }
    }
    if (!foundComment) {
      return {
        success: false,
        error: `Comment '${commentId}' not found`,
        status: 404
      };
    }
    if (foundComment.user_id !== userId) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete this comment',
        status: 403
      };
    }
    if (supabase) {
      const {
        error
      } = await supabase.from('post_comments').delete().eq('id', commentId).eq('user_id', userId);
      if (!error) return {
        success: true,
        status: 200
      };
    }
    if (targetPost && targetPost.comments) {
      targetPost.comments = targetPost.comments.filter(c => c.id !== commentId);
      targetPost.comments_count = targetPost.comments.length;
    }
    return {
      success: true,
      status: 200
    };
  }
  async addPostImage(postId, userId, image) {
    const post = await this.getPostById(postId);
    if (!post) {
      return {
        success: false,
        error: `Post '${postId}' not found`,
        status: 404
      };
    }
    if (post.user_id !== userId) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to add images to this post',
        status: 403
      };
    }
    const newImage = {
      id: `img-${Date.now()}`,
      post_id: postId,
      storage_path: image.storage_path,
      mime_type: image.mime_type,
      size_bytes: image.size_bytes,
      created_at: new Date().toISOString()
    };
    if (supabase) {
      const {
        data,
        error
      } = await supabase.from('post_images').insert({
        post_id: postId,
        storage_path: image.storage_path,
        mime_type: image.mime_type,
        size_bytes: image.size_bytes
      }).select().single();
      if (!error && data) return {
        success: true,
        image: data,
        status: 201
      };
    }
    if (!post.images) post.images = [];
    post.images.push(newImage);
    return {
      success: true,
      image: newImage,
      status: 201
    };
  }
  async saveTrip(trip) {
    const id = trip.id || `trip-${Date.now()}`;
    const saved = {
      ...trip,
      id,
      created_at: new Date().toISOString()
    };
    this.trips.set(id, saved);
    return saved;
  }
  async saveItinerary(itinerary) {
    const id = itinerary.id || `itin-${Date.now()}`;
    const saved = {
      ...itinerary,
      id,
      created_at: new Date().toISOString()
    };
    this.itineraries.set(id, saved);
    return saved;
  }
  async getItineraryById(id) {
    return this.itineraries.get(id) || null;
  }
}
const db = new MemoryDatabase();
exports.db = db;