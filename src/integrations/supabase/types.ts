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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          plan: string
          xp: number
          level: number
          current_streak: number
          best_streak: number
          daily_goal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          plan?: string
          xp?: number
          level?: number
          current_streak?: number
          best_streak?: number
          daily_goal?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          plan?: string
          xp?: number
          level?: number
          current_streak?: number
          best_streak?: number
          daily_goal?: number
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          active?: boolean
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          course_id: string
          name: string
          description: string | null
          order_number: number
          active: boolean
          created_at: string
        }
        Insert: {
          id: string
          course_id: string
          name: string
          description?: string | null
          order_number?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          name?: string
          description?: string | null
          order_number?: number
          active?: boolean
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          course_id: string
          topic_id: string | null
          subtopic: string | null
          difficulty: string
          question_type: string
          question: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          option_e: string
          correct_answer: string
          explanation: string | null
          source_document: string | null
          source_page: string | null
          origin: string | null
          official_exam_question: boolean
          active: boolean
          created_at: string
        }
        Insert: {
          id: string
          course_id: string
          topic_id?: string | null
          subtopic?: string | null
          difficulty?: string
          question_type?: string
          question: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          option_e: string
          correct_answer: string
          explanation?: string | null
          source_document?: string | null
          source_page?: string | null
          origin?: string | null
          official_exam_question?: boolean
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          topic_id?: string | null
          subtopic?: string | null
          difficulty?: string
          question_type?: string
          question?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          option_e?: string
          correct_answer?: string
          explanation?: string | null
          source_document?: string | null
          source_page?: string | null
          origin?: string | null
          official_exam_question?: boolean
          active?: boolean
          created_at?: string
        }
      }
      practice_sessions: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          topic_id: string | null
          mode: string
          total_questions: number
          correct_answers: number
          incorrect_answers: number
          accuracy: number
          duration_seconds: number
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          topic_id?: string | null
          mode?: string
          total_questions?: number
          correct_answers?: number
          incorrect_answers?: number
          accuracy?: number
          duration_seconds?: number
          xp_earned?: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          topic_id?: string | null
          mode?: string
          total_questions?: number
          correct_answers?: number
          incorrect_answers?: number
          accuracy?: number
          duration_seconds?: number
          xp_earned?: number
          completed_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          session_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          time_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          time_seconds?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          time_seconds?: number
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          question_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          created_at?: string
        }
      }
      user_question_progress: {
        Row: {
          id: string
          user_id: string
          question_id: string
          times_answered: number
          correct_count: number
          incorrect_count: number
          last_answered_at: string
          mastered: boolean
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          times_answered?: number
          correct_count?: number
          incorrect_count?: number
          last_answered_at?: string
          mastered?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          times_answered?: number
          correct_count?: number
          incorrect_count?: number
          last_answered_at?: string
          mastered?: boolean
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          target: number
          reward_xp: number
          active: boolean
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          type: string
          target: number
          reward_xp?: number
          active?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          target?: number
          reward_xp?: number
          active?: boolean
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          progress: number
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          progress?: number
          completed?: boolean
          completed_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string | null
          icon: string | null
          requirement_type: string
          requirement_value: number
          reward_xp: number
          active: boolean
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          icon?: string | null
          requirement_type: string
          requirement_value: number
          reward_xp?: number
          active?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          icon?: string | null
          requirement_type?: string
          requirement_value?: number
          reward_xp?: number
          active?: boolean
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          price: number
          started_at: string
          renewal_date: string | null
          cancelled_at: string | null
          provider: string | null
          external_subscription_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan?: string
          status?: string
          price?: number
          started_at?: string
          renewal_date?: string | null
          cancelled_at?: string | null
          provider?: string | null
          external_subscription_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          price?: number
          started_at?: string
          renewal_date?: string | null
          cancelled_at?: string | null
          provider?: string | null
          external_subscription_id?: string | null
        }
      }
    }
  }
}