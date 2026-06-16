import type { LearningObjective } from "../../data/types";
import type { ProductModel } from "../../utils/objectiveMappingViews";
import { getAttentionItems, hasMissingActivities } from "../../utils/objectiveMappingViews";
import styles from "./ObjectiveLinkSummary.module.css";

type ObjectiveLinkSummaryProps = {
  objective: LearningObjective;
  productModel: ProductModel;
};

export function ObjectiveLinkSummary({ objective, productModel }: ObjectiveLinkSummaryProps) {
  const subCount = objective.subObjectives.length;
  const attention = getAttentionItems(objective);
  const gapCount = attention.length;

  return (
    <div className={styles.summary} aria-label="Objective relationships">
      <p className={styles.counts}>
        {subCount} sub-objective{subCount === 1 ? "" : "s"}
        {productModel === "flexible" && objective.linkedPages.length > 0 && (
          <> · {objective.linkedPages.length} direct page{objective.linkedPages.length === 1 ? "" : "s"}</>
        )}
      </p>
      {hasMissingActivities(objective) && (
        <p className={styles.gapLine}>Missing activity links</p>
      )}
      {gapCount > 0 && !hasMissingActivities(objective) && (
        <p className={styles.gapLine}>{gapCount} mapping gap{gapCount === 1 ? "" : "s"}</p>
      )}
    </div>
  );
}
