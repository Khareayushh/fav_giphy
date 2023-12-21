import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { UserAuth } from "../context/AuthContext";

const GiphyItem = ({ image, onAddToFavorites }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleAddToFavorites = async () => {
    setIsSelected((prev) => !prev);
    onAddToFavorites(image);
  };
  const { user } = UserAuth();
  return (
    <li className="masonry-item flex flex-col justify-start align-start p-4">
      <img src={image.images.fixed_height_still.url} alt={image.title} />
      <div className="flex items-start justify-between">
        <div className="mt-2">
          <p className="font-semibold text-base">{image.title}</p>
          {image.username && <p className="text-sm text-[#999FAA]">@{image.username}</p>}
        </div>
        {/* Toggle between StarIcon and StarBorderIcon based on isSelected */}
        {user && (
          <button
            className="ml-2 mt-2 text-yellow-500 cursor-pointer"
            onClick={handleAddToFavorites}
          >
            {isSelected ? (
              <StarIcon className="text-3xl" />
            ) : (
              <StarBorderIcon className="text-3xl" />
            )}
          </button>
        )}
      </div>
    </li>
  );
};

export default GiphyItem;
