import { useState } from 'react';
import { Link } from 'react-router-dom';

function Backup() {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleDownloadBackup = async () => {
    try {
      const response = await fetch('/api/recipes/backup');
      if (!response.ok) throw new Error('Failed to download backup');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'recipes_backup.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Failed to download backup');
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadMessage('');
    setUploadError('');
    
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;
    
    if (!file) {
      setUploadError('Please select a file');
      return;
    }
    
    if (!file.name.endsWith('.json')) {
      setUploadError('Please select a JSON file');
      return;
    }
    
    setUploading(true);
    
    try {
      const response = await fetch('/api/recipes/restore', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to restore backup');
      }
      
      const result = await response.json();
      setUploadMessage(result.message || `Successfully restored ${result.count} recipes`);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error restoring backup:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to restore backup');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Backup & Restore</h1>
        <Link 
          to="/" 
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Back to Recipes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">Download Backup</h5>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Download all your recipes as a JSON file. You can use this file to restore your recipes later.
              </p>
              <button 
                onClick={handleDownloadBackup}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                <i className="bi bi-download me-2"></i>
                Download Backup
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">Restore from Backup</h5>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Upload a JSON backup file to restore your recipes. <strong className="text-gray-900">Warning:</strong> This will replace all existing recipes.
              </p>
              
              {uploadMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4" role="alert">
                  {uploadMessage}
                </div>
              )}
              
              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4" role="alert">
                  {uploadError}
                </div>
              )}
              
              <form onSubmit={handleFileUpload}>
                <div className="mb-4">
                  <input 
                    type="file" 
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                    name="file"
                    accept=".json"
                    disabled={uploading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  <i className="bi bi-upload me-2"></i>
                  {uploading ? 'Restoring...' : 'Restore Backup'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Backup;
