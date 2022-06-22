import { classNames } from "@/utils/classnames";
import Link from "next/link";

export const BreadCrumbs = ({ pages }) => {
  return (
    <nav className="flex mb-11" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-xs leading-5 sm:text-sm text-5F5F5F">
        {pages.map((page, idx) => (
          <li key={page.name + idx}>
            <div className="flex items-center">
              {idx !== 0 && (
                <svg
                  className="flex-shrink-0 w-5 h-5 text-9B9B9B"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              <Crumb page={page} isLast={idx === pages.length - 1} />
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const Crumb = ({ page, isLast }) => {
  if (!page.href) {
    return <div className="ml-1 capitalize">{page.name}</div>;
  }

  return (
    <Link href={page.href}>
      <a
        className={classNames(
          "ml-1 hover:underline capitalize",
          !isLast && "text-4e7dd9"
        )}
        aria-current={page.current ? "page" : undefined}
      >
        {page.name}
      </a>
    </Link>
  );
};
