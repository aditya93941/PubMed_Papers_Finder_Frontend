import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://pubmed-papers-finder-backend.onrender.com/api/papers?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store results in session storage for the results page
      sessionStorage.setItem('searchResults', JSON.stringify(data));
      sessionStorage.setItem('searchQuery', query);
      
      navigate('/results');
    } catch (err) {
      setError('Failed to fetch papers: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="card">
        <h2>Search for Research Papers</h2>
        <p>Enter your search query to find papers with authors from pharmaceutical or biotech companies</p>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="query">Search Query:</label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., cancer immunotherapy"
              disabled={isLoading}
            />
            <small>Supports PubMed's full query syntax</small>
          </div>
          
          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}></span>
                Searching...
              </>
            ) : 'Search Papers'}
          </button>
        </form>
      </div>
      
      <div className="card search-tips">
        <h3>Search Tips</h3>
        <ul>
          <li>Use keywords related to your research interest (e.g., "diabetes", "oncology")</li>
          <li>For specific searches, use PubMed's syntax (e.g., "breast cancer[Title] AND therapy[Title]")</li>
          <li>Narrow by date with date filters (e.g., "covid AND 2021[pdat]")</li>
          <li>Combine terms with AND, OR, NOT (e.g., "gene therapy AND (cancer OR tumor) NOT mouse")</li>
          <li>Results will include only papers with at least one author from a pharmaceutical or biotech company</li>
        </ul>
      </div>
    </div>
  );
}

export default Home; 