import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { User } from "@app-types/auth";
import authService from "@services/auth.service";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    isAdmin: boolean
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.getToken()) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      if (userData?.is_admin) {
        navigate("/admin");
      } else {
        navigate("/userdashboard");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    isAdmin: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register({ email, password, is_admin: isAdmin });
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again with a different email.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
