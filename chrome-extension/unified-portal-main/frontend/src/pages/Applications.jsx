import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, MessageCircle, Filter, Plus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [guidedFlowApps, setGuidedFlowApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, guided, direct

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      // Fetch both regular and guided flow applications
      const [regularRes, guidedRes] = await Promise.all([
        api.get('/applications/').catch(() => ({ data: [] })),
        api.get('/api/guided-flow/applications').catch(() => ({ data: [] }))
      ]);
      
      setApplications(regularRes.data || []);
      setGuidedFlowApps(guidedRes.data || []);
    } catch (error) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'submitted': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'pending':
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'electricity': return 'from-amber-400 to-orange-500';
      case 'gas': return 'from-red-400 to-rose-600';
      case 'water': return 'from-cyan-400 to-blue-500';
      case 'property': return 'from-emerald-400 to-green-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Combine and filter applications based on active tab
  const getFilteredApplications = () => {
    const guidedFormatted = guidedFlowApps.map(app => ({
      ...app,
      service_type: app.category,
      application_type: app.application_type,
      isGuidedFlow: true,
      submitted_at: app.created_at
    }));

    const regularFormatted = applications.map(app => ({
      ...app,
      isGuidedFlow: false
    }));

    switch (activeTab) {
      case 'guided':
        return guidedFormatted;
      case 'direct':
        return regularFormatted;
      default:
        return [...guidedFormatted, ...regularFormatted].sort(
          (a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at)
        );
    }
  };

  const filteredApps = getFilteredApplications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
              <p className="text-gray-500">Track your submitted applications and their status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/services"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Application
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({applications.length + guidedFlowApps.length})
        </button>
        <button
          onClick={() => setActiveTab('guided')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'guided' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Guided Flow ({guidedFlowApps.length})
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            activeTab === 'direct' 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Direct ({applications.length})
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No applications yet</p>
            <p className="text-gray-400 text-sm mb-6">Start by applying for a service</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Apply for Service
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {filteredApps.map((app, index) => (
              <div key={app.tracking_id || app.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side - Application Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`bg-gradient-to-r ${getServiceColor(app.service_type || app.category)} p-2 rounded-lg`}>
                        {app.isGuidedFlow ? (
                          <MessageCircle className="w-5 h-5 text-white" />
                        ) : (
                          <FileText className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {(app.service_type || app.category)} - {(app.application_type || '').replace(/_/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-2">
                          {app.tracking_id ? (
                            <p className="text-sm text-orange-600 font-medium">
                              Tracking ID: {app.tracking_id}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Application ID: #{app.id}
                            </p>
                          )}
                          {app.isGuidedFlow && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                              Guided Flow
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="ml-11 space-y-1 text-sm text-gray-600">
                      {app.provider_name && (
                        <p>
                          <span className="font-medium">Provider:</span> {app.provider_name}
                        </p>
                      )}
                      {(app.submitted_at || app.created_at) && (
                        <p>
                          <span className="font-medium">Submitted:</span> {new Date(app.submitted_at || app.created_at).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      {app.external_reference && (
                        <p>
                          <span className="font-medium">Reference:</span> {app.external_reference}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Status */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4">Application Status Guide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-700">Pending - Under Review</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-700">Submitted - Received</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Completed - Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-700">Rejected - Reapply</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
