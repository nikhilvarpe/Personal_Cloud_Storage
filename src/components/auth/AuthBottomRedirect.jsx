import { Link } from "react-router-dom";

export function AuthBottomRedirect({ text, linkText, linkTo }) {
  return (
    <p className="text-center">
      {text}{" "}
      <Link
        to={linkTo}
        className="inline-flex items-center space-x-1 font-medium text-secondary hover:text-neutral-900"
      >
        <span>{linkText}</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </span>
      </Link>
    </p>
  );
}
