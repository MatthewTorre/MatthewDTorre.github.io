import React from 'react';

const SocialLinks: React.FC = () => {
  return (
    <div className="social-verse" aria-label="Social links">
      <a
        href="https://x.com/MatthewTorre5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
        title="X (Twitter)"
      >
        {/* X / Twitter */}
        <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-hidden="true">
          <path d="M18.244 2H21.5l-7.41 8.47L22.5 22h-6.52l-5.11-6.06L4.9 22H1.64l7.93-9.07L1 2h6.66l4.62 5.48L18.24 2Zm-2.28 18h1.8L7.12 4h-1.9l10.73 16Z" fill="currentColor"/>
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/mtorrestanford/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        {/* LinkedIn */}
        <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM14.5 9c3.038 0 5.5 2.462 5.5 5.5V21h-4v-6c0-1.103-.897-2-2-2s-2 .897-2 2v6h-4V9h4v1.34C11.018 9.5 12.68 9 14.5 9z" fill="currentColor"/>
        </svg>
      </a>
      <a
        href="https://github.com/MatthewTorre"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
      >
        {/* GitHub */}
        <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.06.66-3.71-1.29-3.71-1.29-.5-1.26-1.23-1.6-1.23-1.6-1.01-.69.08-.67.08-.67 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.2 3.24.92.1-.72.39-1.2.71-1.47-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.41.11-2.94 0 0 .95-.3 3.12 1.13.9-.25 1.86-.38 2.82-.38.96 0 1.92.13 2.82.38 2.17-1.43 3.12-1.13 3.12-1.13.61 1.53.22 2.66.11 2.94.71.77 1.14 1.75 1.14 2.95 0 4.22-2.56 5.15-5 5.43.4.35.75 1.03.75 2.08 0 1.5-.01 2.71-.01 3.08 0 .29.2.64.75.53A10.52 10.52 0 0 0 23 11.5C23 5.24 18.27.5 12 .5z"/>
        </svg>
      </a>
      <a
        href="https://www.youtube.com/@Captured./shorts"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        title="YouTube"
      >
        {/* YouTube */}
        <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-hidden="true">
          <path fill="currentColor" d="M23.5 7.5s-.23-1.64-.95-2.36c-.91-.95-1.93-.95-2.4-1C16.9 3.9 12 3.9 12 3.9h-.01s-4.9 0-8.14.24c-.47.05-1.49.05-2.4 1C-.27 5.86 0 7.5 0 7.5S0 9.37 0 11.24v1.52C0 14.63 0 16.5 0 16.5s.23 1.64.95 2.36c.91.95 2.1.92 2.64 1.02 1.92.18 8.41.24 8.41.24s4.9-.01 8.14-.25c.47-.05 1.49-.05 2.4-1 .72-.72.95-2.36.95-2.36s.24-1.87.24-3.74v-1.52c0-1.87-.24-3.74-.24-3.74zM9.54 14.37V7.64l6.28 3.37-6.28 3.36z"/>
        </svg>
      </a>
      <a
        href="https://www.instagram.com/ascattered.mind/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
      >
        {/* Instagram */}
        <svg viewBox="0 0 24 24" width="22" height="22" role="img" aria-hidden="true">
          <path fill="currentColor" d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zM18 6.2a1.2 1.2 0 1 0 1.2 1.2A1.2 1.2 0 0 0 18 6.2z"/>
        </svg>
      </a>
    </div>
  );
};

export default SocialLinks;
