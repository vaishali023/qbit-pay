/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dryrunMessage } from "../utils/ao/message";
import { getTags } from "../utils/ao/get-tags";

const Header = () => {
  const searchTimeoutRef = useRef<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (search.length > 0) {
      handleSearch();
    } else {
      setResult("");
    }
  }, [search]);

  function onSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout to debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      // Perform actual search operation here after 500ms of no typing
      setSearch(value);
    }, 500);
  }
  async function handleSearch() {
    setFetching(true);
    setNotFound(false);
    setResult("");
    try {
      const { Messages } = await dryrunMessage({
        tags: getTags({
          Action: "Get-Transaction",
          "QBit-Id": search,
        }),
      });
      const msg = Messages[0];

      if (!msg) {
        setNotFound(true);
      } else {
        const msgParsed = JSON.parse(msg.Data);
        setResult(msgParsed.qbitId);
      }
      // @ts-nocheck
    } catch (e) {
      console.log(e);
      setNotFound(true);
    }
    setFetching(false);
  }

  function handleResultClick() {
    setSearch("");
    setResult("");
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
                  placeholder="Search transactions..."
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
