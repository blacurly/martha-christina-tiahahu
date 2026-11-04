"use client";

export default function ProgressSteps({
  steps = [],
  currentStep = 0,
}) {
  const progress =
    steps.length > 1
      ? (currentStep / (steps.length - 1)) * 100
      : 0;

  return (
    <div
      className="assessment-progress"
      aria-label={`Langkah ${currentStep + 1} dari ${steps.length}`}
    >
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-steps">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.title}
              className={[
                "progress-step",
                isActive ? "active" : "",
                isCompleted ? "completed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="progress-step-circle">
                {isCompleted ? "✓" : index + 1}
              </div>

              <div className="progress-step-text">
                <span className="progress-step-title">
                  {step.title}
                </span>

                {step.description && (
                  <span className="progress-step-description">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}