import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

const Navigation = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900 text-white">
      <div className="font-bold text-xl">StayEase</div>
      <div className="space-x-4 text-sm">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/manager" className="hover:underline">Manager</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">Role: {user.role}</span>
            <button onClick={logout} className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Not Logged In</span>
        )}
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navigation />
          <main className="p-6 max-w-5xl mx-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<h1 className="text-2xl font-bold">Customer Landing Page (Member 4)</h1>} />
              <Route path="/login" element={<h1 className="text-2xl font-bold">Login Page (Member 1)</h1>} />
              
              {/* Role Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<h1 className="text-2xl font-bold">Admin Dashboard (Member 2)</h1>} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                <Route path="/manager" element={<h1 className="text-2xl font-bold">Manager Dashboard (Member 3)</h1>} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}