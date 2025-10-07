import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthAPI, User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔐 AuthContext: Checking authentication status...');
    try {
      const currentUser = await AuthAPI.getCurrentUser();
      if (currentUser) {
        console.log('✅ AuthContext: User found in storage:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('❌ AuthContext: No authenticated user found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ AuthContext: Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('🔐 AuthContext: Authentication check complete');
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 AuthContext: Logging in user:', email);
    const authResponse = await AuthAPI.login({ email, password });
    console.log('✅ AuthContext: Login successful, setting user state');
    setUser(authResponse.data);
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('🔐 AuthContext: Registering user:', email);
    const authResponse = await AuthAPI.register({ name, email, password });
    console.log('✅ AuthContext: Registration successful, setting user state');
    setUser(authResponse.data);
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  // Debug function to check authentication state
  const debugAuth = async () => {
    console.log('=== AUTH DEBUG ===');
    console.log('User state:', user);
    console.log('Is authenticated:', !!user);
    console.log('Is loading:', isLoading);
    
    const hasToken = await AuthAPI.isAuthenticated();
    console.log('Has stored token:', hasToken);
    
    const storedUser = await AuthAPI.getCurrentUser();
    console.log('Stored user:', storedUser);
    console.log('==================');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  // Add debug function call for development
  if (__DEV__) {
    // Make debugAuth available globally for testing
    (global as any).debugAuth = debugAuth;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};