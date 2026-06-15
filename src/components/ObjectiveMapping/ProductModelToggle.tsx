import type { ProductModel } from "../../utils/objectiveMappingViews";
import styles from "./ProductModelToggle.module.css";

type ProductModelToggleProps = {
  value: ProductModel;
  onChange: (model: ProductModel) => void;
};

export function ProductModelToggle({ value, onChange }: ProductModelToggleProps) {
  return (
    <div className={styles.wrap} role="group" aria-label="Compare product models">
      <p className={styles.label}>Compare data models</p>
      <div className={styles.toggle}>
        <button
          type="button"
          className={`${styles.option} ${value === "strict" ? styles.optionActive : ""}`}
          aria-pressed={value === "strict"}
          onClick={() => onChange("strict")}
        >
          <span className={styles.optionTitle}>Version 1</span>
          <span className={styles.optionDesc}>Strict hierarchy</span>
        </button>
        <button
          type="button"
          className={`${styles.option} ${value === "flexible" ? styles.optionActive : ""}`}
          aria-pressed={value === "flexible"}
          onClick={() => onChange("flexible")}
        >
          <span className={styles.optionTitle}>Version 2</span>
          <span className={styles.optionDesc}>Flexible tagging</span>
        </button>
      </div>
    </div>
  );
}
