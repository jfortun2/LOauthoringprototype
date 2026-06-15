import styles from "./AiSuggestionPlaceholder.module.css";

type AiSuggestion = {
  id: string;
  label: string;
  description: string;
};

const DEFAULT_SUGGESTIONS: AiSuggestion[] = [
  {
    id: "generate-practice",
    label: "Generate practice activity",
    description: "Create formative items aligned to this objective",
  },
  {
    id: "suggest-assessment",
    label: "Suggest additional assessment",
    description: "Recommend summative coverage for gaps",
  },
  {
    id: "identify-gaps",
    label: "Identify content gaps",
    description: "Find objectives with weak page or activity support",
  },
];

type AiSuggestionPlaceholderProps = {
  suggestions?: AiSuggestion[];
  title?: string;
};

export function AiSuggestionPlaceholder({
  suggestions = DEFAULT_SUGGESTIONS,
  title = "Suggested actions",
}: AiSuggestionPlaceholderProps) {
  return (
    <aside className={styles.panel} aria-label="Future AI recommendations">
      <div className={styles.header}>
        <h5 className={styles.title}>{title}</h5>
        <span className={styles.badge}>Coming soon</span>
      </div>
      <p className={styles.hint}>
        AI-assisted course improvement will appear here. Recommendations will always explain why
        they are suggested.
      </p>
      <ul className={styles.list}>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <button type="button" className={styles.action} disabled aria-disabled="true">
              <span className={styles.sparkle} aria-hidden>
                ✨
              </span>
              <span className={styles.actionText}>
                <span className={styles.actionLabel}>{suggestion.label}</span>
                <span className={styles.actionDesc}>{suggestion.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
