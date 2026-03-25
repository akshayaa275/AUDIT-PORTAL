import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { CheckSquare } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Audits from './pages/Audits';
import Findings from './pages/Findings';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/audits" element={
            <PrivateRoute roles={['Admin', 'Auditor']}>
              <Layout>
                <Audits />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/findings" element={
            <PrivateRoute roles={['Admin', 'Auditor']}>
              <Layout>
                <Findings />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute roles={['Admin', 'Auditor']}>
              <Layout>
                <Reports />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/tasks" element={
            <PrivateRoute>
              <Layout>
                <Tasks />
              </Layout>
            </PrivateRoute>
          } />

          {/* Add more routes as we build pages */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
