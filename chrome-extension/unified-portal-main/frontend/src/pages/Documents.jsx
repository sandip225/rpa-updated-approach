import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Upload, FileText, Check, X } from 'lucide-react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('aadhaar');

  const docTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'electricity_bill', label: 'Electricity Bill' },
    { value: 'gas_bill', label: 'Gas Bill' },
    { value: 'water_bill', label: 'Water Bill' },
    { value: 'property_paper', label: 'Property Paper' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/users/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/users/documents/upload?doc_type=${selectedType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Documents</h2>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Upload New Document</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-gray-700 mb-2">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {docTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Select File</label>
            <input
              type="file"
              onChange={handleUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              disabled={uploading}
            />
          </div>
          {uploading && <span className="text-blue-600">Uploading...</span>}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Upload your documents to enable auto-fill. Supported: PDF, JPG, PNG
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{doc.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {docTypes.find(t => t.value === doc.doc_type)?.label || doc.doc_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.is_verified ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-600 text-sm">
                      <Check className="w-4 h-4" /> Uploaded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
