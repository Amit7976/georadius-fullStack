export interface News {
  _id: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  creatorName: string;
  creatorImage: string;
  createdAt: string;
  location: string;
  likes: number;
  comments: number;
  categories: string[];
  images: string[];
  commentsCount: number;
  currentUserProfile: boolean;
  upvoteCount: number;
  downvoteCount: number;
  isUserUpvote: boolean;
  isUserDownvote: boolean;
  isSaved: boolean;
  topComments: CommentType[];
}

export interface UserData {
  fullname: string;
  profileImage: string;
  bio: string;
  location: string;
  currentUserProfile: boolean;
}

export interface MainContentProps {
  username: string;
  userData: UserData;
  userPosts: News[];
  handleHide: (postId: string) => void;
  currentLoginUsername: string;
}

export type Post = {
  _id: string;
  title: string;
  location: string;
  description: string;
  updatedAt: string;
  images: string[];
};

export interface FormDataType {
  username: string;
  fullName: string;
  phoneNumber?: string;
  dob: string;
  location: string;
  bio: string;
  profileImage: File | string;
}

export interface CommentType {
  _id: string;
  comment: string;
  username: string;
  parentCommentId?: string;
  replyingToUsername?: string;
  profileImage?: string;
  updatedAt: string;
  likes: boolean;
  reports: boolean;
}

export interface CurrentUser {
  username: string;
  profileImage?: string;
}

export type NewsPost = {
  _id: string;
  title: string;
  images?: string[];
  creatorName?: string;
  createdAt?: string;
  latitude: number;
  longitude: number;
};

export type TrendingNewsPost = {
  _id: string;
  title?: string;
  image: string;
  creatorName?: string;
  createdAt?: string;
  distance: string;
  upvoteCount: number;
};

export interface FormValues {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  categories: string[];
  images?: File[];
  deletedImages?: string[];
}

export interface MainPostTypes {
  post: {
    _id: string;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    categories: string[];
    images?: File[];
  };
}

export interface Prediction {
  description: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  error?: string;
}

export interface User {
  _id: string;
  username: string;
  fullname: string;
  profileImage: string;
}

export interface ImageSliderProps {
  images: string[];
  height?: number;
}

export interface News {
  _id: string;
  isSaved: boolean;
}

export interface SavedButtonProps {
  news: News;
}

export interface ShareProps {
  _id: string;
  title: string;
  description: string;
  share?: number;
}

export interface ShareButtonProps {
  ShareProps: ShareProps;
}

export interface HeaderFilterProps {
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}
