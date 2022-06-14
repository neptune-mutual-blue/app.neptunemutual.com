import Link from "next/link";
import React from "react";

/**
 *
 * @prop {string} href
 * @prop {JSX.Element} children
 * @returns
 */
function Card({ href, children }) {
  return (
    <Link href={href}>
      <a>
        <div className="flex flex-col items-center max-w-xs text-center bg-FEFEFF rounded-xl px-6 py-14 text-black">
          {children}
        </div>
      </a>
    </Link>
  );
}

function Logo({ children }) {
  return <div className="flex">{children}</div>;
}

function Title({ children }) {
  return <h2 className="flex mt-10 mb-2 font-semibold text-h3 ">{children}</h2>;
}

function Description({ children }) {
  return <p className="flex  text-black text-opacity-50">{children}</p>;
}

export default Object.assign(Card, {
  Logo,
  Title,
  Description,
});
