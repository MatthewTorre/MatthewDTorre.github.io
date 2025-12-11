export type CertTag =
  | "Deep Learning"
  | "Classical ML"
  | "Reinforcement Learning"
  | "Hyperparameter Tuning"
  | "Product"
  | "Agile"
  | "Compliance";

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issued: string;        // YYYY-MM
  expires?: string;      // YYYY-MM
  credentialUrl?: string;
  credentialId?: string;
  context: string;       // one-line explanation
  long?: string;         // back-of-card detailed description
  logoKey?: string;      // optional key for an image registry
  tags: CertTag[];
  source?: "Certification" | "Course";
};

export const certifications: Certification[] = [
  {
    id: "safe-ssm-6",
    title: "Certified SAFe® 6 Scrum Master",
    issuer: "Scaled Agile, Inc.",
    issued: "2025-06",
    expires: "2026-06",
    credentialUrl: "",
    context: "Validated ability to run Scrum at scale—PI planning, iteration execution, and impediment removal in regulated teams.",
    long: "Certified SAFe® 6 Scrum Master (SSM). I completed SAFe 6 training and worked on an Enterprise Architecture team operating in an agile environment. I participated in PI Planning, daily stand‑ups, and iteration ceremonies, kept Jira boards and backlogs tidy, and collaborated with architects and stakeholders (ARB/EA forums) to align work with ART objectives.\n\nKey Skills Built: Agile frameworks (Scrum, Kanban, SAFe), enterprise collaboration, Jira backlog management, program increment planning, cross‑team coordination, architecture alignment",
    logoKey: "scaled-agile",
    tags: ["Agile"],
    source: "Certification",
  },
  {
    id: "leland-pm-bootcamp",
    title: "Product Management Bootcamp",
    issuer: "Leland",
    issued: "2025-03",
    credentialUrl: "",
    context: "Intensive PM training in product sense, design, and strategy with hands-on sprints and critique.",
    long: "Completed Leland’s PM Recruiting Bootcamp (Mar 2025), a seven‑session program focused on product sense, execution/strategy, metrics, and interview prep. Practiced frameworks with peer drills and a coach‑led mock interview; built competency in tackling case prompts, take‑homes, and behavioral stories.\n\nKey Skills Built: Product sense, execution frameworks, business metrics, interview prep, case solving, product storytelling",
    logoKey: "leland",
    tags: ["Product"],
    source: "Course",
  },
  {
    id: "dlai-cnn",
    title: "Convolutional Neural Networks",
    issuer: "DeepLearning.AI",
    issued: "2024-11",
    credentialUrl: "",
    context: "Built and tuned CNNs for image tasks using transfer learning, augmentation, and modern training tricks.",
    long: "Completed DeepLearning.AI’s Convolutional Neural Networks course focused on end‑to‑end vision systems. Implemented modern architectures (ResNet, Inception, MobileNet/EfficientNet), used transfer learning and data augmentation to harden models, and built pipelines for object localization/detection (IoU, NMS, anchors, YOLO) and segmentation (U‑Net). Covered face recognition with one‑shot/Siamese networks and neural style transfer.\n\nKey Skills Built: CNN architectures, object detection, image segmentation, transfer learning, data augmentation, face recognition, neural style transfer",
    logoKey: "deeplearningai",
    tags: ["Deep Learning"],
    source: "Course",
  },
  {
    id: "dlai-improving-dnn",
    title: "Improving Deep Neural Networks",
    issuer: "DeepLearning.AI",
    issued: "2024-10",
    credentialUrl: "",
    context: "Systematic hyperparameter tuning, regularization, and optimization to stabilize and speed up training.",
    long: "Completed Improving Deep Neural Networks focusing on turning deep learning from trial‑and‑error into a repeatable tuning and debugging process. Designed dev/test splits, read bias–variance signals, and stacked regularization (L2, dropout, batch norm) with correct initialization and optimizers (Momentum, RMSprop, Adam). Included hyperparameter tuning strategies, learning‑rate schedules, and gradient checking with a hands‑on TensorFlow implementation.\n\nKey Skills Built: Hyperparameter tuning, regularization (L2, dropout, batch norm), optimization algorithms (Momentum, RMSprop, Adam), TensorFlow, gradient checking, learning‑rate scheduling",
    logoKey: "deeplearningai",
    tags: ["Deep Learning", "Hyperparameter Tuning"],
    source: "Course",
  },
  {
    id: "dlai-nndl",
    title: "Neural Networks and Deep Learning",
    issuer: "DeepLearning.AI",
    issued: "2024-10",
    credentialUrl: "",
    context: "Core DL foundations—forward/backprop, vectorization, activation functions, and basic architectures.",
    long: "Completed Neural Networks and Deep Learning, the foundations of the Deep Learning Specialization. Implemented vectorized logistic regression and one‑/multi‑layer neural nets from scratch, then scaled to deep L‑layer models with clean forward/backprop, proper initialization, and activation choices. Built principled intuition for stable training and correct dimensions.\n\nKey Skills Built: Neural networks, vectorization, backpropagation, initialization, activation functions, deep learning foundations",
    logoKey: "deeplearningai",
    tags: ["Deep Learning"],
    source: "Course",
  },
  {
    id: "dlai-structuring-ml",
    title: "Structuring Machine Learning Projects",
    issuer: "DeepLearning.AI",
    issued: "2024-10",
    credentialUrl: "",
    context: "Error analysis and data-vs-model prioritization framework to iterate ML systems effectively.",
    long: "Completed Structuring Machine Learning Projects with emphasis on making ML work in production. Learned to diagnose failure modes and prioritize fixes (data vs labels vs model), design trustworthy dev/test splits for shifting distributions, and apply human‑level performance to reason about avoidable bias/variance. Covered transfer/multi‑task/end‑to‑end decision frameworks and case studies (Peacetopia, autonomous driving).\n\nKey Skills Built: ML diagnostics, error analysis, data splitting, bias–variance analysis, transfer learning, multi‑task learning, end‑to‑end ML frameworks",
    logoKey: "deeplearningai",
    tags: ["Classical ML", "Product"],
    source: "Course",
  },
];

// Filter out LinkedIn Learning (issuer can vary, but assume "LinkedIn")
export const visibleCertifications = certifications.filter((c) => c.issuer !== "LinkedIn");
