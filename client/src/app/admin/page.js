'use client';

import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  Activity,
  Database,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Building2,
  Globe,
  Mail,
  Bell,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();



  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Not authenticated</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Admin privileges required.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage all user accounts, roles, and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['View all users', 'Edit user roles', 'Delete users', 'User statistics']
    },
    {
      title: 'Company Management',
      description: 'Manage company accounts and profiles',
      href: '/admin/companies',
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      features: ['Approve companies', 'Edit company info', 'Manage verifications', 'Company analytics']
    },
    {
      title: 'Job Management',
      description: 'Monitor and manage all job postings',
      href: '/admin/jobs',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: ['Review job postings', 'Edit job details', 'Delete jobs', 'Job statistics']
    },
    {
      title: 'Application Management',
      description: 'Monitor job applications and responses',
      href: '/admin/applications',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      features: ['View all applications', 'Application analytics', 'Response tracking', 'Application status']
    },
    {
      title: 'Analytics & Reports',
      description: 'Platform analytics and detailed reports',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      features: ['User growth', 'Job statistics', 'Application rates', 'Revenue reports']
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      features: ['Platform config', 'Email settings', 'Security settings', 'Backup management']
    },
    {
      title: 'Security & Permissions',
      description: 'Manage security settings and user permissions',
      href: '/admin/security',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      features: ['Role management', 'Permission settings', 'Security logs', 'Access control']
    },
    {
      title: 'Database Management',
      description: 'Database operations and maintenance',
      href: '/admin/database',
      icon: Database,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      features: ['Data backup', 'Database cleanup', 'Migration tools', 'Performance monitoring']
    },
    {
      title: 'Notifications & Communication',
      description: 'Manage system notifications and communications',
      href: '/admin/notifications',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      features: ['Email templates', 'Push notifications', 'Bulk messaging', 'Notification settings']
    },
    {
      title: 'Activity Monitoring',
      description: 'Monitor platform activity and user behavior',
      href: '/admin/activity',
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      features: ['User activity logs', 'System events', 'Error tracking', 'Performance metrics']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Manage your platform with full administrative control.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Admin Access
              </div>
              <Link 
                href="/dashboard" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.href}
              className="group block"
            >
              <div className={`${feature.bgColor} rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${feature.bgColor} rounded-lg`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {feature.features.map((subFeature, subIndex) => (
                    <div key={subIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {subFeature}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Click to manage</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Platform Activity</h3>
                <Link href="/admin/activity" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all activity
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registration</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Company profile updated</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New job posted</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 