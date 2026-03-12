import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(username, password);
      login(user);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onOAuthLogin() {
    setOauthLoading(true);
    setError("");
    try {
      const authorizationUrl = await api.getOAuthAuthorizationUrl();
      window.location.href = authorizationUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth login failed";
      setError(message);
      toast.error(message);
      setOauthLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        className="app-card w-full max-w-md p-6"
        onSubmit={onSubmit}
        data-testid="login-form"
      >
        <h1 className="text-xl font-semibold">Playwright Practice Login</h1>
        <p className="text-muted mt-1 text-sm" data-testid="login-hint">
          Roles: admin/admin123, editor/editor123, viewer/viewer123
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            className="app-input mt-1"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            data-testid="login-username"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="app-input mt-1"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            data-testid="login-password"
          />
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600" data-testid="login-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn-primary mt-5 w-full py-2 disabled:opacity-60"
          disabled={loading}
          data-testid="login-submit"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <button
          type="button"
          className="btn-secondary mt-3 w-full py-2 disabled:opacity-60"
          disabled={oauthLoading}
          onClick={onOAuthLogin}
          data-testid="oauth-login-btn"
        >
          {oauthLoading ? "Redirecting..." : "Login with OAuth"}
        </button>
      </form>
    </div>
  );
}
