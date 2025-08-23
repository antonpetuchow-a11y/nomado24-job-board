'use client';

import { useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, FileText, LogOut, Plus, Building } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, isAdmin, isCompany, isUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDashboardContent = () => {
    if (isAdmin) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/companies" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Companies</h3>
                <p className="text-gray-600">Create, edit, and delete companies</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/jobs" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Jobs</h3>
                <p className="text-gray-600">View and manage all job postings</p>
              </div>
            </div>
          </Link>
          
          <Link href="/admin/users" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
                <p className="text-gray-600">View and manage user accounts</p>
              </div>
            </div>
          </Link>
        </div>
      );
    }

    if (isCompany) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/company/jobs" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Jobs</h3>
                <p className="text-gray-600">Manage your job postings</p>
              </div>
            </div>
          </Link>
          
          <Link href="/company/applications" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                <p className="text-gray-600">View job applications</p>
              </div>
            </div>
          </Link>
          
          <Link href="/jobs/create" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Plus className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Post New Job</h3>
                <p className="text-gray-600">Create a new job posting</p>
              </div>
            </div>
          </Link>
        </div>
      );
    }

    if (isUser) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/jobs" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-gray-600">Search and apply for jobs</p>
              </div>
            </div>
          </Link>
          
          <Link href="/applications" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
                <p className="text-gray-600">View your job applications</p>
              </div>
            </div>
          </Link>
          
          <Link href="/profile" className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <p className="text-gray-600">Manage your account</p>
              </div>
            </div>
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/images/nomado24-logo.png" 
                alt="Nomado24 Logo" 
                className="h-12 w-auto"
              />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Nomado24 Dashboard</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            {isAdmin && 'You have full administrative access to manage the platform.'}
            {isCompany && 'Manage your job postings and review applications.'}
            {isUser && 'Browse jobs and track your applications.'}
          </p>
        </div>

        {/* Role-specific content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          {getDashboardContent()}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-gray-600">
            <p>Welcome to your dashboard! Start by exploring the available options above.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 