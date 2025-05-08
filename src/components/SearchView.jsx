import { useState } from 'react';

export function SearchView({ apiKey, endpoint, model, apiVersion }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [resultCount, setResultCount] = useState(5);
  const [searchType, setSearchType] = useState('web');

  const validateSettings = () => {
    if (!apiKey?.trim()) {
      setError('Please enter your API key in settings');
      return false;
    }
    if (!endpoint?.trim()) {
      setError('Please enter your Azure OpenAI endpoint in settings');
      return false;
    }
    if (!model?.trim()) {
      setError('Please enter your model deployment name in settings');
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    if (!query.trim()) return;
    if (!validateSettings()) return;

    setIsLoading(true);
    setSearchResults([]);

    try {
      // This is a mock implementation - in a real app, you would use a search API
      const baseEndpoint = endpoint.replace(/\/$/, '');
      const response = await fetch(`${baseEndpoint}/openai/deployments/${model}/chat/completions?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: `You are a search assistant. The user is searching for: "${query}". 
              Provide ${resultCount} relevant search results in the format:
              [
                {
                  "title": "Result title",
                  "url": "https://example.com/result",
                  "snippet": "A short description of the result"
                },
                ...more results
              ]
              
              Only respond with this JSON format and nothing else.`
            },
            { 
              role: 'user', 
              content: `Search for: ${query}` 
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message) {
        throw new Error('Invalid response format from API');
      }
      
      // Parse search results from the response
      try {
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const resultsText = jsonMatch ? jsonMatch[0] : content;
        const parsedResults = JSON.parse(resultsText);
        setSearchResults(parsedResults);
      } catch (parseError) {
        console.error('Failed to parse search results:', parseError);
        throw new Error('Failed to parse search results');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while searching. Please check your settings and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages search-content">
        {searchResults.length === 0 && !error && !isLoading && (
          <div className="empty-state">
            Search for anything. Configure your Azure OpenAI settings to get started.
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search results for "{query}"</h3>
            <ul className="search-results-list">
              {searchResults.map((result, index) => (
                <li key={index} className="search-result-item">
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="search-result-title">
                    {result.title}
                  </a>
                  <div className="search-result-url">{result.url}</div>
                  <div className="search-result-snippet">{result.snippet}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking">Searching...</div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleSearch}>
        <div className="chat-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            disabled={isLoading}
          />
          <div className="chat-input-buttons">
            <button type="button" onClick={() => setShowOptions(!showOptions)} title="Search options">⚙️</button>
            <button type="submit" disabled={isLoading} title="Search">🔍</button>
          </div>
        </div>
      </form>
      
      {showOptions && (
        <div className="options-menu">
          <div className="search-options">
            <label>
              Results count:
              <select 
                value={resultCount} 
                onChange={(e) => setResultCount(parseInt(e.target.value))}
                disabled={isLoading}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </label>
            <label>
              Search type:
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                disabled={isLoading}
              >
                <option value="web">Web</option>
                <option value="images">Images</option>
                <option value="news">News</option>
              </select>
            </label>
            <button onClick={() => setSearchResults([])}>Clear Results</button>
          </div>
        </div>
      )}
    </div>
  );
}