import type { CoverageContentItem, ContentDetailSelection } from "../../utils/coverageMap";
import styles from "./ContentDetailPanel.module.css";

type ContentDetailPanelProps = {
  selection: ContentDetailSelection;
  cellItems?: CoverageContentItem[];
  onSelectItem: (item: CoverageContentItem) => void;
  onClose: () => void;
};

export function ContentDetailPanel({
  selection,
  cellItems,
  onSelectItem,
  onClose,
}: ContentDetailPanelProps) {
  const { item, subObjectiveTitle, columnLabel, path } = selection;
  const listItems = cellItems && cellItems.length > 1 ? cellItems : null;

  const typeClass =
    item.kind === "page"
      ? styles.metaPage
      : item.assessmentType === "summative"
        ? styles.metaSummative
        : styles.metaFormative;

  const typeLabel =
    item.kind === "page"
      ? "Page"
      : item.assessmentType === "summative"
        ? "Summative"
        : "Formative";

  return (
    <aside className={styles.detailPanel} aria-label="Content details">
      <div className={styles.detailHeader}>
        <h5 className={styles.detailTitle}>{item.title}</h5>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>

      <p className={styles.detailContext}>
        {subObjectiveTitle} · {columnLabel}
      </p>

      <div className={styles.detailMeta}>
        <span className={`${styles.metaPill} ${typeClass}`}>{typeLabel}</span>
      </div>

      <p className={styles.detailPath}>{path}</p>

      {listItems && (
        <ul className={styles.itemList}>
          {listItems.map((listItem) => (
            <li key={listItem.id}>
              <button
                type="button"
                className={`${styles.itemBtn} ${listItem.id === item.id ? styles.itemBtnSelected : ""}`}
                onClick={() => onSelectItem(listItem)}
              >
                <span className={styles.itemTitle}>{listItem.title}</span>
                <span className={styles.itemType}>
                  {listItem.kind === "page" ? "Page" : listItem.assessmentType ?? "Activity"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
