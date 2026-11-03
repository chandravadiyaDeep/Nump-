import type { PublicCard } from "./public-site";

export const serviceCards: PublicCard[] = [
  { title: "Dataset Analysis", description: "Inspect a dataset, understand its structure and review data-quality signals before changing anything.", href: "/services/dataset-analysis", eyebrow: "Available in workspace" },
  { title: "Data Cleaning", description: "Preview cleaning operations, review their effects and export a separate cleaned dataset.", href: "/services/data-cleaning", eyebrow: "Available in workspace" },
  { title: "ML Readiness", description: "Assess dataset suitability for classification, regression, forecasting or clustering with explainable dimensions.", href: "/services/ml-readiness", eyebrow: "Available in workspace" },
  { title: "AI Tools", description: "A future collection of focused AI-assisted tools. This category is not presented as a live standalone service yet.", href: "/services/ai-tools", eyebrow: "Planned" },
];

export const learnCards: PublicCard[] = [
  { title: "Artificial Intelligence", description: "Understand AI concepts, terminology, practical applications and limitations.", href: "/learn/artificial-intelligence" },
  { title: "Machine Learning", description: "Learn model types, training workflows, validation, evaluation and common pitfalls.", href: "/learn/machine-learning" },
  { title: "Data Science", description: "Explore the end-to-end process from data questions to analysis and communication.", href: "/learn/data-science" },
  { title: "Python", description: "Build practical foundations for working with data using Python and its ecosystem.", href: "/learn/python" },
];

export const exploreCards: PublicCard[] = [
  { title: "Blog", description: "Practical articles about data quality, analysis and machine learning workflows.", href: "/blog" },
  { title: "Tutorials", description: "Step-by-step learning material with examples and clear prerequisites.", href: "/explore/tutorials" },
  { title: "Infographics", description: "Visual explanations of data and machine-learning concepts.", href: "/explore/infographics" },
  { title: "Research", description: "Research notes and evidence-led explanations with source references.", href: "/explore/research" },
];

export const resourceCards: PublicCard[] = [
  { title: "Datasets", description: "Find public datasets and understand their source, format and usage terms.", href: "/resources/datasets" },
  { title: "Cheat Sheets", description: "Compact references for common data and machine-learning workflows.", href: "/resources/cheat-sheets" },
  { title: "Learning Roadmaps", description: "Structured learning sequences for building practical data skills.", href: "/resources/learning-roadmaps" },
  { title: "Useful Tools", description: "A curated directory of tools and official documentation.", href: "/resources/useful-tools" },
];

export const communityCards: PublicCard[] = [
  { title: "Write for NUMPA", description: "Learn the editorial standards for proposing an original article or tutorial.", href: "/community/write-for-numpa" },
  { title: "Authors", description: "Understand author attribution and review expectations. No contributor profiles are published until verified.", href: "/community/authors" },
  { title: "Contributions", description: "Explore how to contribute code, documentation and learning resources.", href: "/community/contributions" },
];

export const learnContent: Record<string, { title: string; description: string; sections: { heading: string; paragraphs: string[]; bullets?: string[] }[] }> = {
  "artificial-intelligence": {
    title: "Artificial Intelligence",
    description: "A practical starting point for understanding AI systems, their capabilities and their limitations.",
    sections: [
      { heading: "What AI means", paragraphs: ["Artificial intelligence is a broad field focused on building systems that perform tasks commonly associated with human reasoning, perception, language or decision-making. It includes many approaches, from rule-based systems to machine learning and generative models."] },
      { heading: "A useful learning sequence", paragraphs: ["Start with programming and data literacy, then learn core machine-learning ideas before exploring deep learning and generative AI. Keep evaluation, privacy, bias and reliability in the learning process rather than treating them as optional topics."] },
    ],
  },
  "machine-learning": {
    title: "Machine Learning",
    description: "Learn how datasets, validation strategies and model evaluation fit together in a reliable ML workflow.",
    sections: [
      { heading: "The workflow", paragraphs: ["A typical machine-learning project defines a task, inspects the available data, prepares features, selects a validation strategy, trains candidate models and evaluates results on data not used to fit the model. The workflow is iterative: poor results may reveal data-quality or problem-definition issues."] },
      { heading: "Why data quality matters", paragraphs: ["Missing values, duplicates, inconsistent categories, leakage and unrepresentative samples can distort evaluation. A readiness assessment can help identify risks before training, but no single score guarantees model performance."] },
      { heading: "Core topics to study", paragraphs: [], bullets: ["Classification and regression", "Forecasting and time-aware validation", "Clustering and unsupervised evaluation", "Train, validation and test separation", "Data leakage and reproducibility"] },
    ],
  },
  "data-science": {
    title: "Data Science",
    description: "A practical introduction to asking questions, inspecting data, analysing evidence and communicating findings.",
    sections: [
      { heading: "From question to evidence", paragraphs: ["Data science begins with a clear question and an understanding of how the data was collected. Inspect its structure, assess missingness and quality, explore distributions and relationships, then choose analysis methods that match the question."] },
      { heading: "Communicating responsibly", paragraphs: ["Explain assumptions, limitations and uncertainty. A chart or metric should answer a question, not merely decorate a report. Keep transformations reproducible and distinguish correlation from causation."] },
    ],
  },
  python: {
    title: "Python for Data Work",
    description: "A learning path for using Python to inspect, transform, analyse and model data.",
    sections: [
      { heading: "Start with the foundations", paragraphs: ["Learn variables, collections, conditions, loops, functions, modules, exceptions and virtual environments. Practice reading files and writing small reusable functions before moving to larger data workflows."] },
      { heading: "Build the data stack", paragraphs: ["After core Python, learn NumPy arrays, pandas DataFrames, plotting and scikit-learn pipelines. Use official documentation and small reproducible projects to reinforce each topic."] },
    ],
  },
};

export const resourceContent: Record<string, { title: string; description: string; sections: { heading: string; paragraphs: string[]; bullets?: string[] }[] }> = {
  datasets: {
    title: "Public Datasets",
    description: "A starting directory for finding data to practise analysis and machine learning. Always check source terms before reuse.",
    sections: [
      { heading: "Where to look", paragraphs: ["Prefer dataset publishers and official repositories so you can inspect provenance, documentation, licensing and collection methods."], bullets: ["UCI Machine Learning Repository — https://archive.ics.uci.edu/", "Government open-data portals and national statistics offices — check each portal's licence and terms", "Kaggle Datasets — https://www.kaggle.com/datasets — review each dataset's licence and source"] },
      { heading: "Before using a dataset", paragraphs: ["Record the source, version, licence, target definition, collection period, known limitations and whether personal or sensitive information is present. Do not upload sensitive data to a third-party service without authorization."] },
    ],
  },
  "cheat-sheets": {
    title: "Cheat Sheets",
    description: "Quick-reference material for common data and machine-learning tasks.",
    sections: [
      { heading: "Recommended references", paragraphs: ["Use maintained official documentation as the source of truth. A concise reference should help you navigate the documentation, not replace it."], bullets: ["pandas user guide — https://pandas.pydata.org/docs/user_guide/", "NumPy reference — https://numpy.org/doc/stable/", "scikit-learn user guide — https://scikit-learn.org/stable/user_guide.html"] },
    ],
  },
  "learning-roadmaps": {
    title: "Learning Roadmaps",
    description: "Suggested sequences for building practical skills without skipping foundations.",
    sections: [
      { heading: "Data analyst path", paragraphs: ["Learn spreadsheets and SQL basics, descriptive statistics, data cleaning, exploratory analysis, visualization and clear reporting. Build projects using documented public datasets."] },
      { heading: "Machine-learning path", paragraphs: ["Build Python and statistics foundations, learn data preparation and validation, study supervised and unsupervised learning, then practise evaluation and reproducibility on complete projects."] },
      { heading: "Keep the sequence flexible", paragraphs: ["Choose projects that answer real questions. Revisit fundamentals when a project exposes a gap; a roadmap is a guide, not a certification or guarantee of employment."] },
    ],
  },
  "useful-tools": {
    title: "Useful Data Tools",
    description: "A small, documentation-first directory of tools relevant to data workflows.",
    sections: [
      { heading: "Core ecosystem", paragraphs: ["The tools below are widely used in data workflows. Check current documentation, compatibility and licensing before adopting them."], bullets: ["Python — https://www.python.org/", "pandas — https://pandas.pydata.org/", "Jupyter — https://jupyter.org/", "scikit-learn — https://scikit-learn.org/", "GitHub — https://github.com/"] },
    ],
  },
};

export const blogPosts = [
  {
    slug: "data-quality-before-machine-learning",
    title: "Why data quality should come before machine learning",
    summary: "A practical explanation of why dataset inspection, cleaning and validation belong before model training.",
    category: "Machine Learning",
    updated: "November 3, 2026",
    intro: "A machine-learning model can only learn from the information and patterns represented in its training data. Before selecting algorithms, understand what the dataset contains, how it was collected and which quality issues may affect the result.",
    sections: [
      { heading: "Start by understanding the dataset", paragraphs: ["Inspect row and column counts, data types, missing values, duplicate records, target distribution and suspicious values. These checks help reveal whether the dataset matches the problem you want to solve.", "Do not assume that every missing value is an error or that every duplicate should be removed. Decisions depend on how the data was collected and what each row represents."] },
      { heading: "Treat cleaning as a reviewed transformation", paragraphs: ["Preview transformations before applying them. Keep the source unchanged and create a separate cleaned output so the effect of each operation can be inspected and reproduced."] },
      { heading: "Protect evaluation from leakage", paragraphs: ["Fit preprocessing steps only on training data within the validation pipeline. Information from validation or test data must not influence training-time transformations or feature selection.", "Choose a split strategy that reflects the real task. Time-dependent data generally needs time-aware validation rather than a random split."] },
      { heading: "Use readiness scores carefully", paragraphs: ["A readiness assessment can summarize data-quality risks and point to next steps. It is a heuristic, not a guarantee of accuracy, fairness or production performance."] },
    ],
    sources: [
      { label: "scikit-learn: Common pitfalls and recommended practices", url: "https://scikit-learn.org/stable/common_pitfalls.html" },
      { label: "scikit-learn: Cross-validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    ],
  },
  {
    slug: "understanding-missing-values",
    title: "Understanding missing values before filling them",
    summary: "How to inspect missingness and choose a treatment based on context rather than applying one automatic rule.",
    category: "Data Cleaning",
    updated: "November 3, 2026",
    intro: "Missing values are not all the same. A blank cell may mean a measurement was not taken, a question did not apply, a system failed to record a value or the value was intentionally withheld.",
    sections: [
      { heading: "Measure the pattern", paragraphs: ["Calculate missing counts and percentages by column and, where useful, by important groups or time periods. Check whether missingness is concentrated in particular segments.", "Review whether a column is essential to the task and whether missingness itself may carry information."] },
      { heading: "Choose a defensible treatment", paragraphs: ["Possible treatments include leaving values missing for models that support them, imputing with a statistic or domain rule, adding a missingness indicator, or excluding rows/columns when justified. Document the choice and its limitations."] },
      { heading: "Avoid leakage", paragraphs: ["For predictive modelling, learn imputation values from the training split only. Apply the fitted transformation to validation and test data without recalculating statistics from those sets."] },
    ],
    sources: [
      { label: "pandas: Working with missing data", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
      { label: "scikit-learn: Imputation of missing values", url: "https://scikit-learn.org/stable/modules/impute.html" },
    ],
  },
];
