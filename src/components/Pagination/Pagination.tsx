import {
  IconChevronDoubleLeft,
  IconChevronDoubleRight,
  IconChevronLeft,
  IconChevronRight,
} from "../icons/Icons";
import styles from "./Pagination.module.css";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const VISIBLE_PAGES = 5;

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = Array.from({ length: Math.min(VISIBLE_PAGES, totalPages) }, (_, i) => i + 1);

  return (
    <div className={styles.pagination} data-node-id="2:1306">
      <p className={styles.summary}>
        Showing result {start} - {end} of {total} total
      </p>
      <nav aria-label="Pagination">
        <ul className={styles.nav}>
          <li>
            <button
              type="button"
              className={`${styles.pageBtn} ${styles.pageBtnIcon}`}
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              aria-label="First page"
            >
              <IconChevronDoubleLeft />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.pageBtn} ${styles.pageBtnIcon}`}
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <IconChevronLeft />
            </button>
          </li>
          {pages.map((p) => (
            <li key={p}>
              <button
                type="button"
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`${styles.pageBtn} ${styles.pageBtnIcon}`}
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <IconChevronRight />
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${styles.pageBtn} ${styles.pageBtnIcon}`}
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              aria-label="Last page"
            >
              <IconChevronDoubleRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
