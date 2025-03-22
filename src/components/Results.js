import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Results() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve results from session storage
    const storedResults = sessionStorage.getItem('searchResults');
    const storedQuery = sessionStorage.getItem('searchQuery');
    
    if (!storedResults) {
      navigate('/');
      return;
    }
    
    try {
      setResults(JSON.parse(storedResults));
      setQuery(storedQuery || '');
    } catch (err) {
      setError('Failed to parse results: ' + err.message);
      navigate('/');
    }
  }, [navigate]);

  const handleDownloadCsv = async () => {
    if (results.length === 0) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch('http://localhost:3001/api/papers/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      // Get the filename from the Content-Disposition header if possible
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'pubmed_papers.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const blob = await response.blob();
      
      // Create a download link and click it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download CSV: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="results-container">
      <div className="card">
        <div className="header-actions">
          <div>
            <h2>Search Results</h2>
            <p>Query: <strong>{query}</strong></p>
            <p>Found <strong>{results.length}</strong> papers with non-academic authors</p>
          </div>
          <div>
            <button onClick={() => navigate('/')} className="btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              New Search
            </button>
            {results.length > 0 && (
              <button 
                onClick={handleDownloadCsv} 
                disabled={isDownloading} 
                className="btn btn-accent"
                style={{ marginLeft: '10px' }}
              >
                {isDownloading ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}></span>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                    Download CSV
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span style={{ marginLeft: '10px' }}>{error}</span>
        </div>
      )}

      {results.length === 0 ? (
        <div className="card">
          <div className="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 15h8M9 9h.01M15 9h.01"></path>
            </svg>
            <p>No results found matching your criteria.</p>
          </div>
        </div>
      ) : (
        <div className="results-list">
          {results.map((paper) => (
            <div key={paper.pubmedId} className="card">
              <h3>{paper.title}</h3>
              
              <div className="paper-details">
                <div className="paper-meta">
                  <p><strong>Publication Date:</strong> {paper.pubDate}</p>
                  <p><strong>PubMed ID:</strong> {paper.pubmedId}</p>
                </div>
                
                <div>
                  <p><strong>Non-academic Authors:</strong></p>
                  <ul className="authors-list">
                    {paper.nonAcademicAuthors.map((author, index) => (
                      <li key={index}>
                        {author}
                        {paper.companyAffiliations[index] && (
                          <span> <strong>({paper.companyAffiliations[index]})</strong></span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {paper.correspondingEmail && (
                  <div className="corresponding-email">
                    <strong>Corresponding Email:</strong>{' '}
                    <a href={`mailto:${paper.correspondingEmail}`}>{paper.correspondingEmail}</a>
                  </div>
                )}
                
                <div className="card-actions">
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pubmedId}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                    View on PubMed
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results; 