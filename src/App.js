import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const MODELS = [
  { id: "runwayml/stable-diffusion-v1-5", name: "Stable Diffusion v1.5", type: "General" },
  { id: "stabilityai/stable-diffusion-2-1", name: "Stable Diffusion v2.1", type: "High Res" },
  { id: "prompthero/openjourney", name: "OpenJourney", type: "Artistic" },
  { id: "SG161222/Realistic_Vision_V5.1_noVAE", name: "Realistic Vision", type: "Photorealistic" },
  { id: "dreamlike-art/dreamlike-diffusion-1.0", name: "Dreamlike", type: "Fantasy" },
];

const BASE_MODEL_URL = "https://api-inference.huggingface.co/models/";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("imaginex_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("hf_api_token") || process.env.REACT_APP_HF_API_TOKEN || ""
  );
  const [showSettings, setShowSettings] = useState(
    !localStorage.getItem("hf_api_token") && !process.env.REACT_APP_HF_API_TOKEN
  );

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("hf_api_token", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("imaginex_history", JSON.stringify(history));
  }, [history]);

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    if (!apiKey) {
      setError("Please provide a Hugging Face API Token in settings.");
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BASE_MODEL_URL}${selectedModel}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      
      const newCreation = {
        id: Date.now(),
        url: imageUrl,
        prompt: prompt,
        model: MODELS.find(m => m.id === selectedModel)?.name || "Unknown",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setHistory(prev => [newCreation, ...prev].slice(0, 10));
    } catch (err) {
      console.error("Error generating image:", err);
      setError(
        err.response?.status === 401
          ? "Invalid API Token. Please check your token and try again."
          : err.response?.status === 503
          ? "Model is loading. Please try again in 5-10 seconds."
          : "An error occurred while generating the image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imgUrl, imgPrompt) => {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `imaginex-${imgPrompt.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your generation history?")) {
      setHistory([]);
      localStorage.removeItem("imaginex_history");
    }
  };

  return (
    <div className="App">
      <header>
        <div className="logo-container">
          <div className="logo-icon"></div>
          <h1>ImagineX</h1>
        </div>
        <p className="subtitle">
          Professional-grade AI generation at your fingertips.
        </p>
      </header>

      <div className="toolbar">
        <button 
          className={`toolbar-btn ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </button>
      </div>

      <main className="main-container">
        <div className="input-section">
          {showSettings && (
            <div className="api-key-config animate-slide-down">
              <h3>Hugging Face Configuration</h3>
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="hf_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="helper-text">
                Your token is stored locally for session persistence. <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer">Get one here.</a>
              </p>
            </div>
          )}

          <div className="model-selection animate-fade-in">
            <label>Select AI Model</label>
            <div className="model-grid">
              {MODELS.map(model => (
                <button
                  key={model.id}
                  className={`model-card ${selectedModel === model.id ? 'active' : ''}`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <span className="model-name">{model.name}</span>
                  <span className="model-type">{model.type}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={generateImage} className="prompt-form">
            <div className="input-group">
              <label htmlFor="prompt">Enter Visionary Prompt</label>
              <textarea
                id="prompt"
                placeholder="A digital painting of a cosmic lighthouse at the edge of the universe, vibrant colors, cinematic lighting, 8k..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="generate-btn" 
              disabled={loading || !prompt}
            >
              {loading ? (
                <div className="loading-spinner-inline"></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  Generate Masterpiece
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-badge animate-shake">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}
        </div>

        <div className="output-section">
          {!loading && !image && !error && (
            <div className="placeholder-text animate-fade-in">
              <div className="placeholder-orb"></div>
              <h3>Ready to Imagine</h3>
              <p>Type your prompt and witness the power of Stable Diffusion.</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="processing-indicator"></div>
              <p>Dreaming of your masterpiece...</p>
              <div className="status-progress">
                <div className="status-line"></div>
              </div>
            </div>
          )}

          {image && !loading && (
            <div className="result-container animate-scale-up">
              <div className="image-wrapper">
                <img src={image} alt={prompt} className="result-image" />
                <div className="image-meta">
                  <span>{MODELS.find(m => m.id === selectedModel)?.name}</span>
                </div>
              </div>
              <div className="image-actions">
                <button className="action-btn download-primary" onClick={() => handleDownload(image, prompt)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Save Image
                </button>
                <button className="action-btn" onClick={() => setImage(null)}>
                  New Prompt
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {history.length > 0 && (
        <section className="history-section animate-slide-up">
          <div className="history-header">
            <h2>Recent Creations</h2>
            <button className="clear-history" onClick={clearHistory}>Clear All</button>
          </div>
          <div className="history-grid">
            {history.map((item) => (
              <div key={item.id} className="history-card" onClick={() => {
                setImage(item.url);
                setPrompt(item.prompt);
              }}>
                <img src={item.url} alt={item.prompt} />
                <div className="history-info">
                  <p className="history-prompt">{item.prompt}</p>
                  <p className="history-model">{item.model}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer>
        <p>&copy; 2026 ImagineX AI. Integrated with Hugging Face Inference Infrastructure.</p>
      </footer>
    </div>
  );
}
