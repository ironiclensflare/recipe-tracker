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
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Backup & Restore</h1>
        <Link to="/" className="btn btn-secondary">Back to Recipes</Link>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Download Backup</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Download all your recipes as a JSON file. You can use this file to restore your recipes later.
              </p>
              <button 
                onClick={handleDownloadBackup}
                className="btn btn-primary"
              >
                <i className="bi bi-download me-2"></i>
                Download Backup
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Restore from Backup</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Upload a JSON backup file to restore your recipes. <strong>Warning:</strong> This will replace all existing recipes.
              </p>
              
              {uploadMessage && (
                <div className="alert alert-success" role="alert">
                  {uploadMessage}
                </div>
              )}
              
              {uploadError && (
                <div className="alert alert-danger" role="alert">
                  {uploadError}
                </div>
              )}
              
              <form onSubmit={handleFileUpload}>
                <div className="mb-3">
                  <input 
                    type="file" 
                    className="form-control" 
                    name="file"
                    accept=".json"
                    disabled={uploading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-warning"
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
