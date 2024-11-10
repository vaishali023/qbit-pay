/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { dryrunMessage } from "../utils/ao/message";
import { getTags } from "../utils/ao/get-tags";

const Header = () => {
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notFoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  const [result, setResult] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Clear search input when navigating back to the home page
  useEffect(() => {
    if (location.pathname === "/") {
      setSearch("");
      setResult(null);
      setNotFound(false);
    }
  }, [location.pathname]);

  // Debounce effect for search input
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // Perform search when `debouncedSearch` updates
  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      setResult(null);
      setNotFound(false); // Reset if search is cleared
    }
  }, [debouncedSearch]);

  function onSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value); // Triggers debounce
  }

  async function handleSearch(query: string) {
    setFetching(true);
    setNotFound(false);
    setResult(null);

    // Generate tags for the search
    const tags = getTags({
      Action: "Get-Transaction",
      "QBit-Id": query,
    });

    try {
      const response = await dryrunMessage({ tags });

      const { Messages } = response || {};
      if (!Messages || Messages.length === 0) {
        setNotFound(true);

        // Auto-hide 'not found' message after 3 seconds
        if (notFoundTimeoutRef.current)
          clearTimeout(notFoundTimeoutRef.current);
        notFoundTimeoutRef.current = setTimeout(() => setNotFound(false), 3000);
      } else {
        const msgParsed = JSON.parse(Messages[0].Data);
        setResult(msgParsed.qbitId);
        setNotFound(false);
      }
    } catch (error) {
      setNotFound(true);
      if (notFoundTimeoutRef.current) clearTimeout(notFoundTimeoutRef.current);
      notFoundTimeoutRef.current = setTimeout(() => setNotFound(false), 3000);
    }
    setFetching(false);
  }

  function handleResultClick() {
    setSearch("");
    setResult(null);
    setNotFound(false);
    setFetching(false);
    navigate(`/app/transactions/${result}`);
  }
  return (
    <header className="bg-transparent h-[92px] border-b border-gray-700 px-12 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-xl font-bold">
            Qbit Pay
          </Link>
          <div className="w-[700px]">
            <div className="w-full">
              <div className="relative">
                <input
                  onChange={onSearchInputChange}
                  type="text"
                  placeholder="Search transactions by Qbit Id..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded flex items-center text-white focus:outline-none focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {(fetching || result || notFound) && (
                  <div className="flex rounded-bl min-h-[80px] rounded-br flex-col w-full p-4 bg-white opacity-70 absolute bottom-[-80px] left-0">
                    {fetching && (
                      <div className="flex items-center justify-center h-full flex-1">
                        <h1 className="text-gray-800 font-medium">
                          Searching...
                        </h1>
                      </div>
                    )}
                    {notFound && (
                      <div className="flex items-center justify-center h-full flex-1">
                        <h1 className="text-gray-800 font-medium">Not found</h1>
                      </div>
                    )}
                    {result && (
                      <div
                        onClick={handleResultClick}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="flex items-center bg-gray-800/50 rounded-sm p-2">
                          <h1>
                            <h1 className="text-gray-800 font-medium">
                              {result}
                            </h1>
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <nav>
            <Link
              to="/app"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
