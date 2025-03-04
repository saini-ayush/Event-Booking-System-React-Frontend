import axios from "axios";
import api from "./api";
import {
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  User,
} from "@app-types/auth";

const API_URL = "http://localhost:8000/api/v1";

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
