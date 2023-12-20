"use client";
import { TextField } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import {
  collection,
  getDocs,
  query,
  querySnapshot,
  onSnapshot,
  addDoc,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import { CloseFullscreen } from "@mui/icons-material";
import GiphyItem from "./components/GiphyItem";
import FavItem from "./components/FavItem";
import { Island_Moments } from "next/font/google";

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

  const handleAddToFavorites = async (image) => {
    if (!user) {
      alert("User must log in to use this feature");
      return;
    }

    // Create a reference to the document using a combination of user_id and giphy_id
    const compositeKey = `${user.uid}_${image.id}`;
    const docRef = doc(db, "favoritegiphs", compositeKey);

    // Check if the document already exists
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("Document already exists in the database");
      return;
    }

    try {
      // Add the selected image to the "favoritegiphs" collection in Firestore
      await setDoc(docRef, {
        composite_key: compositeKey, // Include the composite key in the document data
        giphy_id: image.id,
        gif_url: image.images.downsized_medium.url,
        name: image.title,
        upload_by: image.username || "",
        user_id: user.uid,
      });

      console.log("Document added to favorites successfully");
    } catch (error) {
      console.error("Error adding to favorites:", error.message);
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
          setIsLoading(true);

          // Query favorite items only for the current user
          const q = query(
            collection(db, "favoritegiphs"),
            where("user_id", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);
          const favorites = [];

          querySnapshot.forEach((doc) => {
            favorites.push(doc.data());
          });

          setFavoriteItems(favorites);
        } catch (error) {
          console.error("Error fetching favorites:", error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  console.log(favoriteItems);

  return (
    <>
      <div className="bg-white max-w-5xl m-auto py-2 rounded-xl maincomp">
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

        {isLoading && (
          <div className="flex absolute top-1/2 left-1/2 items-center justify-center">
            <div class="loader "></div>
          </div>
        )}

        {!displayedResults && !isLoading && favoriteItems && user && (
          <div className="favorite m-6">
            <p className="text-lg font-semibold">Favorites⭐️</p>
            <ul className="grid grid-cols-3 masonry-container">
              {favoriteItems.map((result) => (
                <li
                  className="masonry-item flex flex-col justify-start align-start p-4"
                  key={result.giphy_id}
                >
                  <img src={result.gif_url} alt={result.name} />
                  <div className="mt-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">{result.name}</p>
                      {result.upload_by && (
                        <p className="text-sm">@{result.upload_by}</p>
                      )}
                    </div>
                    <p className="text-yellow-500">
                      <StarIcon />
                    </p>
                  </div>
                </li>
                // <FavItem key={result.id} result={result}/>
              ))}
            </ul>
          </div>
        )}

        {displayedResults && !isLoading && (
          <div>
            <ul className="grid grid-cols-3 masonry-container">
              {displayedResults.map((result) => (
                <GiphyItem
                  key={result.id}
                  image={result}
                  onAddToFavorites={handleAddToFavorites}
                />
              ))}
            </ul>
          </div>
        )}

        {/* pagination code */}
        {searchResults && !isLoading && (
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
