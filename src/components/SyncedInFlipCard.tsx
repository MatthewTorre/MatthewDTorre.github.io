import React from 'react';
import FlipCard from './FlipCard';

export default function SyncedInFlipCard() {
  const Front = (
    <div className="syn-front">
      <div className="syn-head">
        <div className="syn-bubble">AI</div>
        <div className="syn-title">
          <h3>Synced-In</h3>
          <p>Synchrony Hackathon — Top 10 / 140+</p>
        </div>
      </div>
      <div className="syn-tags">
        {['RAG', 'Semantic Search', 'Embeddings', 'Flask API', 'LLM Integration', 'Scalable Arch'].map(t => (
          <span key={t} className="syn-chip">{t}</span>
        ))}
      </div>
      <div className="syn-footer">
        <span>Click or press Enter to flip</span>
        <span>Details →</span>
      </div>
    </div>
  );

  const Back = (
    <div className="syn-back">
      <h4>Synced-In (Synchrony Hackathon)</h4>
      <p>
        Built Synced-In: an AI powered internal tool that lets anyone search in natural language to find
        subject matter experts. Designed and implemented a retrieval augmented architecture using Flask and
        JSON datasets with keyword extraction and semantic search for ranking. Built a modular backend with
        API endpoints for query handling, LLM integration, and top match highlighting. Planned integrations
        with Workday, Jira, Confluence, and Microsoft Teams using embedding based retrieval to overcome
        context window limits and enable cross functional knowledge sharing. Pitched to over 190 leaders across
        Technology and Operations. Finished Top 10 of 140+ teams.
      </p>
      <div className="syn-skill-wrap">
        <p className="syn-skill-title">Key Skills Built</p>
        <ul className="skills-row">
          {['RAG', 'Semantic search', 'Embedding retrieval', 'Flask APIs', 'LLM integration', 'Scalable design'].map(s => (
            <li key={s} className="skill-chip">{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return <FlipCard front={Front} back={Back} className="syn-card" />;
}

