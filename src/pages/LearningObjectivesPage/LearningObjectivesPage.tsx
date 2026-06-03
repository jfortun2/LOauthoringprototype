import { useState } from "react";
import { ObjectiveCard } from "../../components/ObjectiveCard/ObjectiveCard";
import { Pagination } from "../../components/Pagination/Pagination";
import { IconExternalLink, IconSort } from "../../components/icons/Icons";
import { objectives, TOTAL_OBJECTIVES } from "../../data/objectives";
import styles from "./LearningObjectivesPage.module.css";

export function LearningObjectivesPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("2");
  const [page, setPage] = useState(1);

  const filtered = objectives.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className={styles.page} data-node-id="2:1265">
      <div className={styles.container}>
        <header>
          <h2 className={styles.heading} data-node-id="2:1269">
            Learning Objectives
          </h2>
          <div className={styles.intro}>
            <p className={styles.introText}>
              Learning objectives help you to organize course content and determine
              appropriate assessments and instructional strategies. Refer to the{" "}
              <a
                href="https://www.cmu.edu/teaching/designteach/design/learningobjectives.html"
                className={styles.introLink}
                target="_blank"
                rel="noopener noreferrer"
                data-node-id="2:1274"
              >
                CMU Eberly Center guide on learning objectives
                <IconExternalLink />
              </a>{" "}
              to learn more about the importance of attaching learning objectives to
              pages and activities.
            </p>

            <div className={styles.searchRow}>
              <div className={styles.searchFieldWrap}>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search learning objectives"
                />
                {search && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <button type="button" className={styles.btnSearch}>
                Search
              </button>
            </div>

            <div className={styles.sortRow}>
              <select className={styles.sortSelect} defaultValue="title" aria-label="Sort by">
                <option value="title">Title</option>
              </select>
              <button type="button" className={styles.sortBtn} aria-label="Toggle sort direction">
                <IconSort />
              </button>
            </div>
          </div>
        </header>

        <div className={styles.createRow}>
          <button type="button" className={styles.btnCreate} data-node-id="2:1303">
            Create new Objective
          </button>
        </div>

        <section className={styles.listSection} aria-label="Learning objectives list">
          <Pagination
            page={page}
            pageSize={20}
            total={TOTAL_OBJECTIVES}
            onPageChange={setPage}
          />

          <ul className={styles.objectiveList}>
            {filtered.map((objective) => (
              <li key={objective.id}>
                <ObjectiveCard
                  objective={objective}
                  expanded={expandedId === objective.id}
                  onToggle={() => toggleExpanded(objective.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
