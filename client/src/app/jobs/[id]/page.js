'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../utils/AuthContext';
import { jobsAPI, applicationsAPI } from '../../../utils/api';
import { Building, MapPin, Calendar, Users, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getById(id);
      setJob(response.data.job);
    } catch (error) {
      toast.error('Failed to fetch job details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      toast.error('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      router.push('/login');
      return;
    }

    if (!cvFile) {
      toast.error('Please select a CV file');
      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);

      await applicationsAPI.apply(id, formData);
      toast.success('Application submitted successfully!');
      router.push('/applications');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Job not found</p>
          <Link href="/" className="btn-primary mt-4">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  {job.company.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.company.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job._count.applications} applications
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>
            </div>
          </div>

          {/* Apply Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h3>
              
              {!isAuthenticated ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Please login to apply for this job</p>
                  <Link href="/login" className="btn-primary w-full">
                    Login to Apply
                  </Link>
                </div>
              ) : !isUser ? (
                <div className="text-center">
                  <p className="text-gray-600">Only job seekers can apply for positions</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload your CV (PDF only)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="cv"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="cv"
                        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {cvFile ? cvFile.name : 'Choose PDF file'}
                      </label>
                    </div>
                    {cvFile && (
                      <p className="text-sm text-green-600 mt-1">✓ File selected</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={applying || !cvFile}
                    className="btn-primary w-full"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">About {job.company.name}</h4>
                <p className="text-sm text-gray-600">
                  {job.company.description || 'No company description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 