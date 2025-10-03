interface User {
  id: number
  username: string
  email: string
  role: "citizen" | "officer" | "admin"
}

interface AuthTokens {
  access: string
  refresh: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export class AuthService {
  private static getStoredTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null

    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")

    if (access && refresh) {
      return { access, refresh }
    }

    return null
  }

  private static setTokens(tokens: AuthTokens): void {
    localStorage.setItem("access_token", tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
  }

  private static clearTokens(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
  }

  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Login failed")
    }

    const tokens = await response.json()
    this.setTokens(tokens)

    // Decode user info from token (simplified - in production, fetch user profile)
    const user = this.getUserFromToken(tokens.access)
    localStorage.setItem("user", JSON.stringify(user))

    return { user, tokens }
  }

  static async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Registration failed")
    }

    return response.json()
  }

  static async refreshToken(): Promise<string> {
    const tokens = this.getStoredTokens()
    if (!tokens) throw new Error("No refresh token available")

    const response = await fetch(`${API_BASE_URL}/api/users/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })

    if (!response.ok) {
      this.clearTokens()
      throw new Error("Token refresh failed")
    }

    const { access } = await response.json()
    localStorage.setItem("access_token", access)
    return access
  }

  static logout(): void {
    this.clearTokens()
  }

  static getAccessToken(): string | null {
    const tokens = this.getStoredTokens()
    return tokens?.access || null
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  static isAuthenticated(): boolean {
    return this.getAccessToken() !== null
  }

  private static getUserFromToken(token: string): User {
    // In a real app, decode JWT or fetch user profile
    // For now, return mock data based on token
    return {
      id: 1,
      username: "user",
      email: "user@example.com",
      role: "citizen",
    }
  }

  static async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    let token = this.getAccessToken()

    if (!token) {
      throw new Error("No access token available")
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    // If token expired, try to refresh
    if (response.status === 401) {
      try {
        token = await this.refreshToken()
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        })
      } catch {
        this.clearTokens()
        throw new Error("Authentication failed")
      }
    }

    return response
  }
}
