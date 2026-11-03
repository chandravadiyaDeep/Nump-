"use client";

type WorkflowProgressProps = {
  activeSection: string;
  hasFile: boolean;
  inspected: boolean;
  cleaned: boolean;
  readinessComplete: boolean;
  comparisonComplete: boolean;
  onNavigate: (section: string) => void;
};

const stages = [
  { id: "source", label: "Upload", section: "Data Analysis", requirement: "file" },
  { id: "inspect", label: "Inspect", section: "Data Analysis", requirement: "file" },
  { id: "prepare", label: "Prepare", section: "Data Preprocessing / Cleaning", requirement: "inspected" },
  { id: "analyze", label: "Analyze", section: "Data Analysis", requirement: "inspected" },
  { id: "visualize", label: "Visualize", section: "Data Visualization", requirement: "inspected" },
  { id: "readiness", label: "ML readiness", section: "ML Readiness", requirement: "inspected" },
  { id: "models", label: "Compare models", section: "ML Lab", requirement: "inspected" },
] as const;

export function WorkflowProgress({
  activeSection, hasFile, inspected, cleaned, readinessComplete, comparisonComplete, onNavigate,
}: WorkflowProgressProps) {
  const completed = new Set<string>();
  if (hasFile) completed.add("source");
  if (inspected) completed.add("inspect");
  if (cleaned) completed.add("prepare");
  if (readinessComplete) completed.add("readiness");
  if (comparisonComplete) completed.add("models");

  function isAvailable(requirement: string) {
    return requirement === "file" ? hasFile || !inspected : inspected;
  }

  return (
    <section className="workflow-progress" aria-label="Dataset workflow progress">
      <div className="workflow-progress-heading">
        <div>
          <p className="workflow-progress-eyebrow">YOUR DATA WORKFLOW</p>
          <h2>One dataset. A connected workflow.</h2>
        </div>
        <span className="workflow-progress-state">{inspected ? "Dataset inspected" : hasFile ? "Ready to inspect" : "Waiting for dataset"}</span>
      </div>
      <ol className="workflow-progress-steps">
        {stages.map((stage, index) => {
          const done = completed.has(stage.id);
          const available = isAvailable(stage.requirement);
          const active = activeSection === stage.section && (
            stage.id === "source" || stage.id === "inspect" ? activeSection === "Data Analysis" :
            stage.id === "prepare" ? activeSection === "Data Preprocessing / Cleaning" :
            stage.id === "visualize" ? activeSection === "Data Visualization" :
            stage.id === "readiness" ? activeSection === "ML Readiness" :
            stage.id === "models" ? activeSection === "ML Lab" : false
          );
          return (
            <li key={stage.id} className={`workflow-progress-step${done ? " is-complete" : ""}${active ? " is-current" : ""}${!available ? " is-locked" : ""}`}>
              <button
                type="button"
                onClick={() => available && onNavigate(stage.section)}
                disabled={!available}
                aria-current={active ? "step" : undefined}
                title={!available ? "Inspect a dataset before opening this stage." : `Open ${stage.label}`}
              >
                <span className="workflow-progress-index">{done ? "✓" : String(index + 1).padStart(2, "0")}</span>
                <span className="workflow-progress-label">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="workflow-progress-note">Your original upload stays separate from cleaned outputs. Later stages become available when their required dataset is inspected.</p>
    </section>
  );
}
