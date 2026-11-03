// Curated, source-attributed resources for people working with data.
// Link targets point to publisher-maintained documentation or repositories.
// Dataset-level licences and terms must always be checked at the original source.

export type CuratedResource = {
  title: string;
  publisher: string;
  description: string;
  url: string;
  category: "datasets" | "documentation" | "learning" | "visualization" | "quality" | "tools";
  level: "Beginner" | "Intermediate" | "Advanced" | "All levels";
  access: "Free" | "Open source" | "Mixed";
  note: string;
  tags: string[];
};

export const curatedResources: CuratedResource[] = [
  // Dataset discovery
  { title: "UCI Machine Learning Repository", publisher: "UCI", description: "Research datasets with descriptions and task context for learning and benchmarking.", url: "https://archive.ics.uci.edu/", category: "datasets", level: "All levels", access: "Free", note: "Check the individual dataset page for its licence, citation and permitted uses.", tags: ["tabular", "classification", "regression", "benchmark"] },
  { title: "OpenML", publisher: "OpenML", description: "Discover datasets, tasks, runs and reproducible machine-learning experiments.", url: "https://www.openml.org/", category: "datasets", level: "Intermediate", access: "Free", note: "OpenML platform data and metadata are CC-BY; individual datasets can have separate terms and citation requests.", tags: ["benchmark", "experiments", "metadata", "reproducibility"] },
  { title: "Hugging Face Datasets", publisher: "Hugging Face", description: "Explore community datasets across text, image, audio and structured-data tasks.", url: "https://huggingface.co/datasets", category: "datasets", level: "All levels", access: "Mixed", note: "Review each dataset card, licence, access restrictions and intended use before downloading or redistributing.", tags: ["NLP", "computer vision", "audio", "dataset cards"] },
  { title: "Kaggle Datasets", publisher: "Kaggle", description: "Search community-published datasets and notebooks for practice and exploration.", url: "https://www.kaggle.com/datasets", category: "datasets", level: "All levels", access: "Mixed", note: "Public visibility does not mean unrestricted reuse. Check the dataset's own licence and source attribution.", tags: ["practice", "community", "CSV", "notebooks"] },
  { title: "World Bank Open Data", publisher: "World Bank", description: "Explore development indicators and country-level data across many topics.", url: "https://data.worldbank.org/", category: "datasets", level: "All levels", access: "Free", note: "Review the relevant data catalogue and terms, especially for third-party sourced indicators.", tags: ["economics", "indicators", "time series", "global"] },
  { title: "data.gov.in", publisher: "Government of India", description: "Discover datasets and APIs published through India's Open Government Data platform.", url: "https://www.data.gov.in/", category: "datasets", level: "All levels", access: "Mixed", note: "Check each resource's reuse conditions, attribution requirements and update frequency.", tags: ["India", "government", "public data", "API"] },
  { title: "Google Dataset Search", publisher: "Google", description: "Find datasets hosted by universities, publishers, public agencies and repositories.", url: "https://datasetsearch.research.google.com/", category: "datasets", level: "All levels", access: "Mixed", note: "This is a discovery engine, not a blanket licence. Follow through to the original publisher.", tags: ["discovery", "research", "catalogue"] },

  // Learning
  { title: "Google Machine Learning Crash Course", publisher: "Google for Developers", description: "Hands-on modules covering ML fundamentals, data, classification, neural networks and production topics.", url: "https://developers.google.com/machine-learning/crash-course/", category: "learning", level: "Beginner", access: "Free", note: "Self-paced learning resource; review module prerequisites and exercises.", tags: ["machine learning", "classification", "data", "interactive"] },
  { title: "Google ML Foundational Courses", publisher: "Google for Developers", description: "A structured sequence covering ML introduction, problem framing and managing ML projects.", url: "https://developers.google.com/machine-learning/foundational-courses", category: "learning", level: "Beginner", access: "Free", note: "Follow the recommended order or select a course based on your current knowledge.", tags: ["roadmap", "problem framing", "projects"] },
  { title: "NumPy Learn", publisher: "NumPy", description: "Curated tutorials and learning material for arrays and numerical computing.", url: "https://numpy.org/learn/", category: "learning", level: "Beginner", access: "Free", note: "Maintained by NumPy contributors; follow links to the relevant tutorial and documentation.", tags: ["Python", "arrays", "numerical computing"] },
  { title: "Python Tutorial", publisher: "Python Software Foundation", description: "The official introduction to Python syntax, data structures, modules and errors.", url: "https://docs.python.org/3/tutorial/", category: "learning", level: "Beginner", access: "Free", note: "A programming foundation; it assumes some familiarity with programming concepts.", tags: ["Python", "programming", "foundations"] },
  { title: "scikit-learn User Guide", publisher: "scikit-learn", description: "Practical reference for preprocessing, pipelines, model selection, evaluation and clustering.", url: "https://scikit-learn.org/stable/user_guide.html", category: "learning", level: "Intermediate", access: "Open source", note: "Examples are useful, but select validation and metrics to match your real problem.", tags: ["ML", "pipelines", "evaluation", "preprocessing"] },

  // Official documentation
  { title: "pandas User Guide", publisher: "pandas", description: "DataFrame operations, IO, missing data, joins, reshaping, grouping and time series.", url: "https://pandas.pydata.org/docs/user_guide/", category: "documentation", level: "All levels", access: "Open source", note: "Use the guide alongside the API reference for version-specific behavior.", tags: ["cleaning", "missing values", "DataFrame", "analysis"] },
  { title: "NumPy Documentation", publisher: "NumPy", description: "Array creation, indexing, broadcasting, vectorization and numerical routines.", url: "https://numpy.org/doc/stable/", category: "documentation", level: "All levels", access: "Open source", note: "Official user guide and API reference.", tags: ["arrays", "Python", "numerical"] },
  { title: "Python Documentation", publisher: "Python Software Foundation", description: "Language tutorial, standard library, HOWTOs and reference documentation.", url: "https://docs.python.org/3/", category: "documentation", level: "All levels", access: "Free", note: "Choose documentation matching the Python version used by your project.", tags: ["Python", "language", "standard library"] },
  { title: "Jupyter Documentation", publisher: "Project Jupyter", description: "Documentation for notebooks, JupyterLab and interactive computing workflows.", url: "https://docs.jupyter.org/", category: "documentation", level: "All levels", access: "Open source", note: "Notebook files can contain executable code and outputs; inspect before sharing.", tags: ["notebooks", "reproducibility", "interactive"] },
  { title: "SciPy Documentation", publisher: "SciPy", description: "Scientific computing tools for statistics, optimization, linear algebra and signal processing.", url: "https://docs.scipy.org/doc/scipy/", category: "documentation", level: "Intermediate", access: "Open source", note: "Review function assumptions and numerical limitations for your use case.", tags: ["statistics", "scientific computing", "Python"] },
  { title: "scikit-learn Documentation", publisher: "scikit-learn", description: "API reference, examples and guidance for classical machine-learning workflows.", url: "https://scikit-learn.org/stable/", category: "documentation", level: "Intermediate", access: "Open source", note: "Includes guidance on common pitfalls, preprocessing, validation and model evaluation.", tags: ["classification", "regression", "clustering", "ML"] },

  // Data quality and validation
  { title: "Pandera", publisher: "Pandera", description: "DataFrame schemas and validation for checking data types, columns and business rules.", url: "https://pandera.readthedocs.io/", category: "quality", level: "Intermediate", access: "Open source", note: "A validation library; define checks that reflect the meaning and constraints of your data.", tags: ["validation", "schema", "Python", "quality"] },
  { title: "Great Expectations", publisher: "Great Expectations", description: "A data quality framework for defining, documenting and validating expectations.", url: "https://docs.greatexpectations.io/", category: "quality", level: "Intermediate", access: "Open source", note: "Check current product edition and feature availability in the official documentation.", tags: ["data quality", "testing", "expectations"] },
  { title: "Frictionless", publisher: "Frictionless Data", description: "Tools and specifications for describing, validating and working with tabular data packages.", url: "https://framework.frictionlessdata.io/", category: "quality", level: "Intermediate", access: "Open source", note: "Useful for structured metadata, tabular validation and data exchange.", tags: ["CSV", "validation", "metadata", "tabular"] },

  // Visualization
  { title: "Matplotlib Tutorials", publisher: "Matplotlib", description: "Learn plotting fundamentals, chart composition and customization in Python.", url: "https://matplotlib.org/stable/tutorials/", category: "visualization", level: "Beginner", access: "Open source", note: "Choose chart types that match the data and question; label units and axes.", tags: ["charts", "Python", "plotting"] },
  { title: "Seaborn Tutorial", publisher: "Seaborn", description: "Statistical data visualization with approachable high-level plotting functions.", url: "https://seaborn.pydata.org/tutorial.html", category: "visualization", level: "Intermediate", access: "Open source", note: "Understand statistical aggregation and uncertainty shown by each plot.", tags: ["statistics", "Python", "visualization"] },
  { title: "Observable Plot", publisher: "Observable", description: "A JavaScript plotting library for exploratory data visualization.", url: "https://observablehq.com/plot/", category: "visualization", level: "Intermediate", access: "Open source", note: "Review examples and API docs; ensure visual encodings are accessible.", tags: ["JavaScript", "charts", "web"] },
  { title: "Datawrapper Academy", publisher: "Datawrapper", description: "Guidance on choosing and designing clear charts, maps and tables.", url: "https://academy.datawrapper.de/", category: "visualization", level: "Beginner", access: "Free", note: "Educational material; product plans and publishing features may have separate terms.", tags: ["chart design", "maps", "communication"] },

  // Useful tools
  { title: "Hugging Face Hub", publisher: "Hugging Face", description: "Explore models, datasets, Spaces and open ML tooling.", url: "https://huggingface.co/", category: "tools", level: "All levels", access: "Mixed", note: "Model and dataset licences vary by repository; inspect cards and terms individually.", tags: ["models", "datasets", "AI", "community"] },
  { title: "GitHub", publisher: "GitHub", description: "Version control collaboration, source review and issue tracking for data projects.", url: "https://github.com/", category: "tools", level: "All levels", access: "Mixed", note: "Public repositories are not automatically open source; check each repository licence.", tags: ["version control", "collaboration", "code"] },
  { title: "Kaggle Notebooks", publisher: "Kaggle", description: "Explore and run community notebooks for data analysis and machine learning practice.", url: "https://www.kaggle.com/code", category: "tools", level: "Beginner", access: "Mixed", note: "Review notebook code, data licences and resource limits before running or reusing.", tags: ["notebooks", "practice", "Python"] },
];

export const resourceCategories = [
  { id: "all", label: "All resources" },
  { id: "datasets", label: "Datasets" },
  { id: "learning", label: "Learning" },
  { id: "documentation", label: "Documentation" },
  { id: "quality", label: "Data quality" },
  { id: "visualization", label: "Visualization" },
  { id: "tools", label: "Tools" },
] as const;
