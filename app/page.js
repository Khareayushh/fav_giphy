"use client";
import { TextField } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection,
  getDocs,
  query,
  querySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import { CloseFullscreen } from "@mui/icons-material";

export default function Home() {
  const RESULTS_PER_PAGE = 6;

  const { user } = UserAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      if (searchTerm.length === 0) return;
      const apiKey = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";
      const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;
      const response = await fetch(url);
      const dataFromApi = await response.json();

      setSearchResults(dataFromApi.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error is there", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(searchResults);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const displayedResults = searchResults?.slice(startIndex, endIndex);

  const totalPages = Math.ceil((searchResults?.length || 0) / RESULTS_PER_PAGE);
  // console.log(searchTerm);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "favoritegiphs"));
          const favorites = [];
          querySnapshot.forEach((doc) => {
            favorites.push(doc.data());
          });
          setFavoriteItems(favorites);
        } catch (error) {
          console.error("Error fetching favorites:", error.message);
        }
      }
    };

    fetchData();
  }, [user]);

  console.log(favoriteItems);

  return (
    <>
      <div className="bg-white max-w-5xl m-auto py-2 rounded-xl">
        <div className="flex align-center justify-between h-12 search m-6">
          <SearchIcon className="absolute top mt-3 ml-2" />
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 pl-10 w-full bg-[#F2F4F8] rounded-xl font-semibold"
            type="text"
            placeholder="Search gif"
          ></input>
          <button
            onClick={handleSearch}
            className="bg-black text-white rounded-xl px-4 mx-4 font-semibold"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Read favorite items from database of user with specific userId. */}

        {!displayedResults && favoriteItems && user && (
          <div className="favorite m-6">
            <p className="text-lg font-semibold">Favorites⭐️</p>
            <ul className="grid grid-cols-3 masonry-container">
              {favoriteItems.map((result) => (
                <li
                  className="masonry-item flex flex-col justify-start align-start p-4"
                  key={result.giphy_id}
                >
                  <img
                    src={result.gif_url}
                    alt={result.name}
                  />
                  <div className="mt-2">
                    <p className="font-semibold text-lg">{result.name}</p>
                    {result.upload_by && (
                      <p className="text-sm">@{result.upload_by}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {displayedResults && (
          <div>
            <ul className="grid grid-cols-3 masonry-container">
              {displayedResults.map((result) => (
                <li
                  className="masonry-item flex flex-col justify-start align-start p-4"
                  key={result.id}
                >
                  <img
                    src={result.images.downsized_medium.url}
                    alt={result.title}
                  />
                  <div className="mt-2">
                    <p className="font-semibold text-lg">{result.title}</p>
                    {result.username && (
                      <p className="text-sm">@{result.username}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {searchResults && (
          <div className="flex justify-center align-items">
            <div>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[#272727] font-semibold p-2"
              >
                Previous
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? "active p-2 bg-red-50 mx-1"
                      : "p-2 mx-1"
                  }
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="text-[#272727] font-semibold p-2"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
