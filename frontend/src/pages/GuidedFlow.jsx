import { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import api from '../api/axios';

const GuidedFlow = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidedFlowApplications();
  }, []);

  const fetchGuidedFlowApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/guided-flow/');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching guided flow applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Guided Flow Applications</h1>
            <p className="text-orange-100">Applications submitted through WhatsApp bot</p>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Guided Flow Applications</h3>
          <p className="text-gray-500">You haven't submitted any applications through WhatsApp yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(app.status)}
                    <h3 className="text-lg font-semibold text-gray-800">{app.service_name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Guided Flow
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Application ID:</span>
                      <span className="ml-2 font-medium text-gray-800">{app.application_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <span className="ml-2 font-medium text-gray-800">
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {app.phone_number && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 font-medium text-gray-800">{app.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  {app.tracking_url && (
                    <a
                      href={app.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Track <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuidedFlow;
