export type Attachment = { label: string; href: string };
export type Project = {
  id: string; // slug, also used for inferred cover path
  title: string;
  org?: string;
  dates?: string; // preferred field name
  // For backward-compatibility during refactor
  date?: string; // legacy field (not required)
  // New fields per spec
  coverKey?: string; // base filename without extension
  snippet: string; // short teaser for card
  description: string; // full text for reader
  attachments?: Attachment[]; // rendered as chips/buttons
  // Legacy fields kept so older UI continues to compile during rollout
  summary?: string;
  details?: string;
  cover?: string;
  links?: Attachment[];
};

// To add a new project:
// - Choose a unique `id` (slug). If `cover` is omitted, the UI will try `/images/projects/<id>.jpg`.
// - Provide `title`, optional `org`, `dates` (or `date`), a short `summary`, full `details`, and any `links`.
import SOC2Cover from '../assets/images/files-paper-office-paperwork-8952190e545003dbc50f63407b58b521.jpg';

export const projects: Project[] = [
  {
    id: 'synced-in',
    title: 'Synced-In',
    coverKey: 'SYNCEDIN',
    snippet:
      'AI-powered internal expert search with natural-language queries and RAG over JSON datasets.',
    description:
      'Built Synced-In: an AI-powered internal tool that allows anyone in the organization to search in natural language to help users find subject matter experts. Designed and implemented a retrieval-augmented architecture using Flask and JSON-based datasets incorporating keyword extraction and semantic search for ranking recommendations. Built a modular backend with API endpoints for query handling, LLM integration, and top-match highlighting. Designed scalable architecture plans for future integrations with Workday, Jira, Confluence, and Microsoft Teams, including embedding-based retrieval to overcome LLM context window limitations and enable cross-functional knowledge sharing. Pitched to over 190 members of Synchrony\'s Technology and Operations teams, including SVPs, Executive Leadership, and Engineering Leads. Finished in the top 10 of 140+ teams\n\nKey Skills Built: Retrieval-augmented generation (RAG), semantic search, Flask (API development), keyword extraction, embedding-based retrieval, scalable backend architecture',
    attachments: [
      { label: 'GitHub', href: 'https://github.com/pcd15/Synced-In' },
      { label: 'Presentation', href: 'https://www.canva.com/design/DAGuvsVzdcI/9xnfZxC3N0KZIYr-DteMCw/edit?utm_content=DAGuvsVzdcI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton' },
    ],
  },
  {
    id: 'soc2-rag',
    title: 'SOC 2 Evidence Extraction RAG',
    cover: SOC2Cover,
    snippet:
      'RAG system to automate evidence extraction from SOC 2 compliance reports.',
    description:
      "Built a Retrieval Augmented Generation (RAG) system to automate evidence extraction from SOC 2 compliance reports. The pipeline parses both text-native and scanned PDFs, embeds chunked passages, and retrieves top-k evidence to ground LLM answers for audit workflows. A lightweight web UI enables uploading reports and exporting structured findings.\n\nCore Technologies: Python (backend), Flask/Streamlit (UI), PyPDF2 + Tesseract OCR (PDF parsing), OpenAI (GPT-4 + embeddings), FAISS (vector store), RAG architecture, AWS (optional Bedrock models, Textract OCR).\n\nKey Skills Built: Retrieval-augmented generation (RAG), PDF parsing + OCR, embeddings, FAISS vector search, grounding + prompt design, audit/compliance tooling",
    attachments: [
      { label: 'GitHub', href: 'https://github.com/MatthewTorre/Technology_Assessment_Optimization' },
    ],
  },
  {
    id: 'quantum-x-ai',
    title: 'Independent Research: Quantum Computing × AI — Theory & Applications',
    coverKey: 'quantum-x-ai',
    snippet:
      'Survey + framework for QC/AI synergy: Grover, Shor, quantum k-Means, quantum kernels, and research directions.',
    description:
      'In my paper Quantum Computing x AI: Theory and Applications, I developed a framework for uniting quantum algorithms with classical/modern AI with focus on high-impact use cases in finance. I reviewed and contrasted classical vs. quantum models of computation which included foundations and technical grounding. Implemented case studies of Grover’s and Shor’s algorithms to illustrate quantum speedups, and examined how quantum k-Means clustering and quantum kernel methods can extend supervised and unsupervised machine learning. I analyzed optimization through the Quantum Approximate Optimization Algorithm (QAOA). My work required technical grounding in linear algebra, probabilistic models, vectorized operations, kernel design, and complexity tradeoffs, culminating in a roadmap for quantum-enhanced AI that looks to balance theoretical rigor with enterprise applications.\n\nKey Skills Built: quantum kernels, QML framing, complexity intuition, limits & feasibility, Post Quantum Cryptography (PCQ), ',
    attachments: [
      { label: 'Paper', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQGo618k1DnnTw/profile-treasury-document-pdf-analyzed/B56ZgKBVcYHQAg-/0/1752514782069?e=1757548800&v=beta&t=7wz_ow69VAkf97OGY3hgf7juR2d8hSFPb5BI3Shspbk' },
    ],
    // cover intentionally omitted to use inferred path
  },
  {
    id: 'mars-classifier',
    title: 'Mars Surface Image Classifier',
    coverKey: 'MARS',
    snippet:
      'VGG-16 + SIFT/ORB for Curiosity Rover images; robust preprocessing and augmentation.',
    description:
      'For my Mars Surface Image Classifier, I built a complete end to end pipeline that included preprocessing raw images through RGB conversion, resizing to 224×224, normalization, histogram equalization, and noise reduction to stabilize features. I engineered data augmentation with random flips, rotations, and brightness adjustments to improve generalization, and implemented both SIFT and ORB feature extraction, generating descriptors and experimenting with their integration into CNN inputs via heatmap concatenation. I fine tuned a VGG-16 transfer learning architecture by freezing convolutional layers and designing custom classifier layers with dense connections, dropout, batch normalization, and softmax for 25 class output. I carried out structured hyperparameter tuning across learning rates, dropout, batch size, weight decay, and augmentation parameters, training models with Adam optimization and cross entropy loss. I evaluated performance through confusion matrices and class wise error analysis, while leveraging Google Colab and PyTorch for model development and Matplotlib and Seaborn for visualization. This project gave me hands on experience in combining classical feature engineering with deep learning, scaling training workflows, and conducting rigorous model evaluation.\n\nKey Skills Built:  CNNs, feature extraction, vision preprocessing, augmentation, evaluation.',
    attachments: [
      { label: 'Report', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQHA_x2VWlRqGA/profile-treasury-document-pdf-analyzed/B56ZXg6uJtGUAg-/0/1743235253526?e=1757548800&v=beta&t=LmRABbPBT6-4_PwD_jpdKQruyObOiXzmHrvEqieYmfA' }
    ],
  },
  {
    id: 'prodprepai',
    title: 'ProdPrepAI',
    coverKey: 'INTERVIEW',
    snippet:
      'AI tool to help aspiring PMs prepare for interviews.',
    description:
      'I co-developed ProdPrepAI, a full-stack AI platform for product management interview preparation that combined BERT-based multi-label classification with a Deep Q-Network reinforcement learning agent to deliver real-time, adaptive feedback. I built and fine-tuned transformer models for multi-attribute scoring (clarity, completeness, product thinking, feasibility), optimized hyperparameters for stability, and engineered an integration pipeline where the RL agent dynamically guided user responses with reward-based feedback. I designed the training setup with PyTorch, Hugging Face Transformers, and Stable-Baselines3, implemented rigorous evaluation metrics (precision, recall, F1), and managed hyperparameter optimization, model loss stabilization, and reward progression over thousands of episodes. This project strengthened my expertise in transformers, reinforcement learning, hyperparameter tuning, model evaluation, and applied NLP, while also sharpening my ability to frame AI systems for high-stakes, enterprise-level use cases\n\nKey Skills Built: NLP pipelines, prompt/UX design, scoring rubrics, lightweight serving.',
    attachments: [
      { label: 'Paper', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQGkQt0hvnW-WQ/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1734634586926?e=1757548800&v=beta&t=8FFITw09-pYkGQ-HQuAfKU9I_j5C7JKePnO9Ltrf2J8' },
      { label: 'Poster', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQH5y2ujAe9afg/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1734634573214?e=1757548800&v=beta&t=Az_PWF6tCZf1WRgBjF4Yx-SQ_MUFIPI9mWTW-8RGOI8' },
    ],
  },
  {
    id: 'ezrecruit',
    title: 'EzRecruit — MVP & Product Review',
    coverKey: 'EZRECRUIT',
    snippet:
      'Proactive recruitment platform for varsity coaches.',
    description:
      ' EzRecruit is a full cycle recruitment management platform I designed from the ground up, taking it from discovery through product strategy, design, and financial modeling. I conducted 25+ structured interviews with coaches to identify friction points in athlete recruitment workflows, specifically around transcript tracking, call notes, and scheduling inefficiencies, which informed a clear problem definition. I sized the opportunity by building a TAM of 7.8B, SAM of 1.2B, and SOM of 280M, then benchmarked 12 competitor platforms (NCSA, MaxPreps, etc.) to identify unmet market needs. From there, I designed 45+ UI flow screens, created detailed wireframes, and documented 18 backend technical constraints for scalability, modularity, and integrations with scheduling APIs. I modeled monetization through subscription tiers and contracts, projecting an average deal size of 4.5K, CAC of 2.1K, and LTV of 96K, yielding a 3.2x LTV to CAC ratio and 79 percent gross margin. I built feature roadmaps that prioritized automated scheduling, integrated transcript uploads, and intelligent reminders, while outlining technical implementation phases. This project demonstrates not only my ability to identify a large market opportunity, but also to translate user insights into differentiated features, design scalable product architecture, and ground decisions in financial viability, showcasing a comprehensive end to end product skillset.\n\nKey Skills Built:  product discovery, PRDs, workflow design, KPI definition, stakeholder testing.',
    attachments: [
      { label: 'Slidedeck', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQF2GMLYpZk3kA/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1719202537988?e=1757548800&v=beta&t=7S8H6AJgOUXAPevIiOuX86MmeSEmuVYseaVb068z9fI' },
      { label: 'Product Review', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQEGAIQE83u6QQ/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1719202468707?e=1757548800&v=beta&t=iSN4qdF54g7digUEEUMshGPVUaZMGRbbs43uOHOtbz8' },
    ],
  },
  {
    id: 'ufc-outcomes',
    title: 'Predicting UFC Fight Outcomes',
    coverKey: 'MMA',
    snippet:
      'Kaggle dataset… 66.4% acc, 71.4% precision.',
    description:
      'Developed a machine learning pipeline to predict outcomes of 4,896 UFC fights with 119 features using logistic regression, feed-forward neural networks, and dropout regularization. Led end-to-end data engineering, including feature selection, categorical encoding, normalization, and tensor conversion with Pandas, Scikit-learn, and PyTorch. Implemented logistic regression with cross-entropy loss and stochastic gradient descent, achieving 66.4% accuracy and 71.4% precision, outperforming baseline models. Designed and trained feed-forward neural networks with 128- and 64-neuron hidden layers, ReLU activations, and dropout layers, comparing regularized and non-regularized models. Conducted extensive error analysis to identify overfitting and leveraged regularization strategies to close accuracy gaps. Delivered research-backed comparisons against Random Forests and Bayesian networks from prior literature, highlighting tradeoffs between interpretability and predictive power. Strengthened product thinking by framing results for real-world decision-making (betting, sports analytics) and presenting findings through collaborative reports, slide decks, and reproducible Google Colab notebooks.\n\nKey Skills Built:  Logistic Regression, Neural Networks (PyTorch), Dropout Regularization, Cross-Entropy Loss, Stochastic Gradient Descent, Feature Engineering, Error Analysis, Model Evaluation, Sports Analytics, Product-Oriented ML Framing',
    attachments: [
      { label: 'Paper', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQEc50Rm02z0QA/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1719194028609?e=1757548800&v=beta&t=TJEnhpJw1ZlaY6W-yuAiaulb42xJ50OzR3bXr0Cz5Co' },
      { label: 'Code', href: 'https://github.com/austin-salcedo/CS221-UFC-Project' },
    ],
  },
  {
    id: 'qaoa-tsp',
    title: 'Quantum Optimization and the Traveling Salesman Problem',
    
    coverKey: 'NETWORK',
    snippet:
      'Applied QAOA to TSP with Cirq; N=4/8/15.',
    description:
      ' This project applied the Quantum Approximate Optimization Algorithm (QAOA) to the Traveling Salesman Problem (TSP), building both theoretical foundations and practical implementations. I implemented TSP instances with 4, 8, and 15 cities, encoding problem constraints into cost and mixer Hamiltonians using Google’s Cirq library, and ran quantum simulations with 1,000 repetitions per circuit to analyze most-probable bitstring solutions. I developed functions for Hamiltonian construction, circuit layering, and iterative parameter tuning of γ and β values to maximize expectation values, demonstrating how quantum states, entanglement, and superposition can be leveraged for combinatorial optimization. I used NetworkX and Matplotlib to visualize city graphs and solution tours, then validated output tours against known TSP properties. This work showcased skills in quantum computing frameworks, algorithm design, simulation analysis, and bridging classical and quantum methods for NP-hard optimization problems, while highlighting scalability tradeoffs and future product applications in logistics, finance, and cryptography\n\nKey Skills Built: QAOA, variational circuits, problem encoding, visualization, benchmarking.',
    attachments: [
      { label: 'Paper', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQGaoOpQO1LI6g/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1719202952361?e=1757548800&v=beta&t=aSfaQt9078vWa7RldAEsbns-V0AxVm-b12NGr3s6Gms' },
      { label: 'Slidedeck', href: 'https://media.licdn.com/dms/document/media/v2/D562DAQEUYItHk7z-kg/profile-treasury-document-pdf-analyzed/profile-treasury-document-pdf-analyzed/0/1719203186777?e=1757548800&v=beta&t=NWyOeNbXvHmGc3GD_lFyaD-gQvA-eTV46V4da9L21U8' },
      { label: 'Code', href: 'https://github.com/MatthewTorre/Quantum-Approximate-Optimization-Algorithm-As-Applied-to-Traveling-Salesman-Problem/blob/main/physics_14n_qaoa_demo_for_solving_tsp.py' }
    ],
  },

  // Added by request: World Football and Machine Learning
  {
    id: 'world-football-ml',
    title: 'World Football and Machine Learning',
    
    coverKey: 'FOOTBALL',
    snippet: 'Ranking 2021–2022 players with logistic regression and KPIs.',
    description:
      'Built a logistic regression pipeline in Python to statistically identify the top football players from the 2021–2022 season, applying rigorous data science methods to a 876-player dataset. Preprocessed raw CSVs (cleaned missing values, engineered binary “performance” targets, created dummy variables), and implemented end-to-end training with a 70/30 train-test split. Leveraged pandas, numpy, scikit-learn, and seaborn/matplotlib for manipulation, modeling, and visualization. Achieved 94% accuracy, with 1.00 precision for top performers and 0 false positives, demonstrating a conservative but highly reliable classification strategy. Produced classification reports and confusion matrices to evaluate precision-recall tradeoffs (0.92 precision, 1.00 recall for non-top performers; 1.00 precision, 0.79 recall for top performers). Designed a reproducible workflow that outputs probability-ranked players, enabling robust data-driven team selection. Proposed extensions such as specialized metrics for defenders/goalkeepers and more advanced ML models to increase sensitivity and reduce false negatives. Project sharpened skills in statistical modeling, predictive analytics, feature engineering, and product framing of data pipelines for decision-making applications.\n\nKey Skills Built: Logistic regression, predictive analytics, feature engineering, model evaluation (classification reports, confusion matrices), train-test split design, precision-recall analysis, data preprocessing (missing values, dummy variables), visualization (Seaborn, Matplotlib), reproducible ML workflows, product framing of data pipelines for decision-making',
    attachments: [
      { label: 'Code', href: 'https://github.com/MatthewTorre/Selecting-the-Best-Players-in-the-World-Football' }
    ],
  },
];
