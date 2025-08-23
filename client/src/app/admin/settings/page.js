'use client';

import { useAuth } from '../../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../../config/api';
import { 
  Settings, 
  ArrowLeft,
  Save,
  Globe,
  Mail,
  Shield,
  Database,
  Bell,
  Users,
  Building,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Lock,
  Key,
  Server,
  Cloud,
  Download,
  Upload,
  BarChart3
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState({
    platform: {
      name: 'Nomado24 Job Board',
      description: 'Professional job board platform',
      maintenance: false,
      registration: true,
      emailVerification: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@nomado24.com',
      smtpPassword: '********',
      fromEmail: 'noreply@nomado24.com',
      fromName: 'Nomado24 Job Board'
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChar: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enable2FA: false
    },
    features: {
      enableJobAlerts: true,
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enableAnalytics: true,
      enableBackup: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('platform');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin}/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.admin}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        // Show success message
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'platform', name: 'Platform', icon: Globe },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'features', name: 'Features', icon: Settings },
    { id: 'backup', name: 'Backup', icon: Database }
  ];

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600 mt-2">Configure platform settings and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading settings...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Platform Settings */}
                {activeTab === 'platform' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Name
                          </label>
                          <input
                            type="text"
                            value={settings.platform.name}
                            onChange={(e) => handleSettingChange('platform', 'name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Description
                          </label>
                          <input
                            type="text"
                            value={settings.platform.description}
                            onChange={(e) => handleSettingChange('platform', 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">System Status</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${settings.platform.maintenance ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">Maintenance Mode</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('platform', 'maintenance', !settings.platform.maintenance)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.platform.maintenance ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.platform.maintenance ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${settings.platform.registration ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">User Registration</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('platform', 'registration', !settings.platform.registration)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.platform.registration ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.platform.registration ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${settings.platform.emailVerification ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium text-gray-900">Email Verification</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('platform', 'emailVerification', !settings.platform.emailVerification)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.platform.emailVerification ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.platform.emailVerification ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Email Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpHost}
                            onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port
                          </label>
                          <input
                            type="number"
                            value={settings.email.smtpPort}
                            onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Username
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpUser}
                            onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Password
                          </label>
                          <input
                            type="password"
                            value={settings.email.smtpPassword}
                            onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={settings.email.fromEmail}
                            onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={settings.email.fromName}
                            onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Email Configuration</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Configure your SMTP settings to enable email notifications. Test your configuration before saving.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Password Length
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (hours)
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Security Features</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Require Special Characters</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('security', 'requireSpecialChar', !settings.security.requireSpecialChar)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.security.requireSpecialChar ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.security.requireSpecialChar ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Key className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('security', 'enable2FA', !settings.security.enable2FA)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.security.enable2FA ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.security.enable2FA ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Settings */}
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Job Alerts</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('features', 'enableJobAlerts', !settings.features.enableJobAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.features.enableJobAlerts ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.features.enableJobAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('features', 'enableEmailNotifications', !settings.features.enableEmailNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.features.enableEmailNotifications ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.features.enableEmailNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">SMS Notifications</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('features', 'enableSMSNotifications', !settings.features.enableSMSNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.features.enableSMSNotifications ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.features.enableSMSNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Analytics</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('features', 'enableAnalytics', !settings.features.enableAnalytics)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.features.enableAnalytics ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.features.enableAnalytics ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Automatic Backup</span>
                          </div>
                          <button
                            onClick={() => handleSettingChange('features', 'enableBackup', !settings.features.enableBackup)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.features.enableBackup ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.features.enableBackup ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup Settings */}
                {activeTab === 'backup' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Recovery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Manual Backup</h4>
                          <p className="text-sm text-gray-600 mb-4">Create a manual backup of all data</p>
                          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Create Backup
                          </button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Restore Data</h4>
                          <p className="text-sm text-gray-600 mb-4">Restore from a backup file</p>
                          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Restore Backup
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Backup Warning</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Creating backups and restoring data are critical operations. Make sure to test your backup files before performing any restore operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 