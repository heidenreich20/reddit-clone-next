export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          avatar_url: string | null
          body: string | null
          comment_owner: string
          created_at: string
          id: string
          post_id: string
          votes: number | null
        }
        Insert: {
          author_id: string
          avatar_url?: string | null
          body?: string | null
          comment_owner: string
          created_at?: string
          id?: string
          post_id: string
          votes?: number | null
        }
        Update: {
          author_id?: string
          avatar_url?: string | null
          body?: string | null
          comment_owner?: string
          created_at?: string
          id?: string
          post_id?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_avatar_url_fkey"
            columns: ["avatar_url"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["avatar_url"]
          },
          {
            foreignKeyName: "comments_comment_owner_fkey"
            columns: ["comment_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          }
        ]
      }
      communities: {
        Row: {
          community_banner: string | null
          community_icon: string | null
          community_name: string
          created_at: string
          description: string | null
          id: string
          owner: string | null
          post_comments: string | null
          sub_count: number | null
          sub_title: string | null
          subtitle: string | null
        }
        Insert: {
          community_banner?: string | null
          community_icon?: string | null
          community_name: string
          created_at?: string
          description?: string | null
          id?: string
          owner?: string | null
          post_comments?: string | null
          sub_count?: number | null
          sub_title?: string | null
          subtitle?: string | null
        }
        Update: {
          community_banner?: string | null
          community_icon?: string | null
          community_name?: string
          created_at?: string
          description?: string | null
          id?: string
          owner?: string | null
          post_comments?: string | null
          sub_count?: number | null
          sub_title?: string | null
          subtitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      post_comments: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          }
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string | null
          community_id: string | null
          community_name: string | null
          created_at: string
          downvotes: number
          image: string | null
          post_id: string
          title: string
          upvotes: number
          version: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          community_id?: string | null
          community_name?: string | null
          created_at?: string
          downvotes?: number
          image?: string | null
          post_id?: string
          title: string
          upvotes?: number
          version?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          community_id?: string | null
          community_name?: string | null
          created_at?: string
          downvotes?: number
          image?: string | null
          post_id?: string
          title?: string
          upvotes?: number
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_author_name_fkey"
            columns: ["author_name"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          voted_posts: Json[] | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          voted_posts?: Json[] | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          voted_posts?: Json[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      replies: {
        Row: {
          author_id: string
          author_username: string
          avatar_url: string | null
          body: string | null
          created_at: string
          id: string
          post_id: string
          reply_to_comment: string | null
          reply_to_reply: string | null
          votes: number | null
        }
        Insert: {
          author_id: string
          author_username?: string
          avatar_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          post_id: string
          reply_to_comment?: string | null
          reply_to_reply?: string | null
          votes?: number | null
        }
        Update: {
          author_id?: string
          author_username?: string
          avatar_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          post_id?: string
          reply_to_comment?: string | null
          reply_to_reply?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_author_username_fkey"
            columns: ["author_username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "replies_avatar_url_fkey"
            columns: ["avatar_url"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["avatar_url"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "replies_reply_to_comment_fkey"
            columns: ["reply_to_comment"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_reply_to_reply_fkey"
            columns: ["reply_to_reply"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          }
        ]
      }
      subbed_communities: {
        Row: {
          community_icon: string | null
          community_id: string | null
          community_name: string | null
          id: string
          is_favorite: boolean
          joined_at: string
          user_id: string | null
        }
        Insert: {
          community_icon?: string | null
          community_id?: string | null
          community_name?: string | null
          id?: string
          is_favorite?: boolean
          joined_at?: string
          user_id?: string | null
        }
        Update: {
          community_icon?: string | null
          community_id?: string | null
          community_name?: string | null
          id?: string
          is_favorite?: boolean
          joined_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subbed_communities_community_icon_fkey"
            columns: ["community_icon"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_icon"]
          },
          {
            foreignKeyName: "subbed_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subbed_communities_community_name_fkey"
            columns: ["community_name"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["community_name"]
          },
          {
            foreignKeyName: "subbed_communities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      vote_queue: {
        Row: {
          created_at: string | null
          id: number
          post_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: number | null
          user_id?: number | null
        }
        Relationships: []
      }
      voted_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
          vote_id: string
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_id: string
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_id?: string
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voted_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "voted_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
