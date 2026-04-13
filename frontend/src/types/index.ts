export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "alumni" | "admin";
  isApproved: boolean;
  profileImage: string;
  department: string;
  graduationYear: number;
  currentJob: string;
  currentCompany: string;
  location: string;
  phone: string;
  bio: string;
  linkedin: string;
  twitter: string;
  achievements: string[];
  isProfilePublic: boolean;
  createdAt: string;
}

export interface News {
  _id: string;
  title: string;
  content: string;
  category: "news" | "gist" | "community" | "announcement";
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    department: string;
    graduationYear: number;
  };
  isApproved: boolean;
  isFeatured: boolean;
  image: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  total?: number;
  pages?: number;
  currentPage?: number;
}
