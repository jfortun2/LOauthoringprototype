import type { ReactNode } from "react";
import styles from "./MappingPrimitives.module.css";

type MappingSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
};

export function MappingSection({ title, description, children, id }: MappingSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitle} id={id}>
          {title}
        </h4>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

type MappingSummaryProps = {
  items: Array<{ label: string; value: string }>;
};

export function MappingSummary({ items }: MappingSummaryProps) {
  return (
    <dl className={styles.summary}>
      {items.map((item) => (
        <div key={item.label} className={styles.summaryItem}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type SourceLabelProps = {
  label: string;
  variant?: "direct" | "indirect" | "inherited" | "gap";
};

export function SourceLabel({ label, variant = "direct" }: SourceLabelProps) {
  return (
    <span className={`${styles.sourceLabel} ${styles[`source_${variant}`]}`}>{label}</span>
  );
}

type ActivityStatusProps = {
  formativeCount: number;
  summativeCount: number;
  missingFormative?: boolean;
  missingSummative?: boolean;
};

export function ActivityStatus({
  formativeCount,
  summativeCount,
  missingFormative,
  missingSummative,
}: ActivityStatusProps) {
  const hasGap = missingFormative || missingSummative || (formativeCount === 0 && summativeCount === 0);

  return (
    <span className={`${styles.activityStatus} ${hasGap ? styles.activityStatusGap : ""}`}>
      {formativeCount} formative · {summativeCount} summative
    </span>
  );
}

type MappingLinkRowProps = {
  title: string;
  meta?: string;
  sourceLabel: string;
  sourceVariant?: SourceLabelProps["variant"];
  onClick?: () => void;
};

export function MappingLinkRow({
  title,
  meta,
  sourceLabel,
  sourceVariant = "direct",
  onClick,
}: MappingLinkRowProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag type={onClick ? "button" : undefined} className={styles.linkRow} onClick={onClick}>
      <span className={styles.linkMain}>
        <span className={styles.linkTitle}>{title}</span>
        {meta && <span className={styles.linkMeta}>{meta}</span>}
      </span>
      <SourceLabel label={sourceLabel} variant={sourceVariant} />
    </Tag>
  );
}

type MappingEmptyProps = {
  message: string;
};

export function MappingEmpty({ message }: MappingEmptyProps) {
  return <p className={styles.empty}>{message}</p>;
}

type AttentionListProps = {
  items: Array<{ id: string; message: string; action?: string }>;
};

export function AttentionList({ items }: AttentionListProps) {
  if (items.length === 0) {
    return <p className={styles.allClear}>No missing links identified.</p>;
  }

  return (
    <ul className={styles.attentionList}>
      {items.map((item) => (
        <li key={item.id} className={styles.attentionItem}>
          <span className={styles.attentionMessage}>{item.message}</span>
          {item.action && <span className={styles.attentionAction}>{item.action}</span>}
        </li>
      ))}
    </ul>
  );
}

type MappingDetailShellProps = {
  modelLabel: string;
  modelHint: string;
  children: ReactNode;
};

export function MappingDetailShell({ modelLabel, modelHint, children }: MappingDetailShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.modelBanner}>
        <span className={styles.modelBadge}>{modelLabel}</span>
        <p className={styles.modelHint}>{modelHint}</p>
      </div>
      {children}
    </div>
  );
}
