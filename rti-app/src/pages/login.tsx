import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, getPostLoginRoute } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { FcPrivacy } from "react-icons/fc";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const result = auth.login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Invalid credentials.");
      return;
    }

    navigate(getPostLoginRoute({ ...useAuthStore.getState(), isLoggedIn: true }), { replace: true });
  }

  return (
    <ProtectedRoute publicOnly>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
            <FcPrivacy size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">RTI Easy</h1>
          <p className="text-gray-500 text-sm mt-2">
            Your Right to Information, simplified
          </p>
        </div>

        <div className="w-full max-w-sm card shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to file or track your RTI applications
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / User ID
              </label>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rti"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
