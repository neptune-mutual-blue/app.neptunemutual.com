import { classNames } from "@/utils/classnames";
import Link from "next/link";

export const BreadCrumbs = ({ pages }) => {
  return (
    <nav className="flex mb-11" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm text-5F5F5F">
        {pages.map((page, idx) => (
          <li key={page.name}>
            <div className="flex items-center">
              {idx !== 0 && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-9B9B9B"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              <Crumb page={page} idx={idx} />
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const Crumb = ({ page, idx }) => {
  if (!page.href) {
    return <div className="ml-1">{page.name}</div>;
  }

  return (
    <Link href={page.href}>
      <a
        className={classNames(
          "ml-1 hover:underline",
          idx === 0 ? "text-4E7DD9" : ""
        )}
        aria-current={page.current ? "page" : undefined}
      >
        {page.name}
      </a>
    </Link>
  );
};
