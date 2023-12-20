import React, { useState } from "react";

const FavItem = (result) => {
  const [isSelected, setIsSelected] = useState(true);
  console.log(result)
  return (
    <li
      className="masonry-item flex flex-col justify-start align-start p-4"
    >
      <img src={result.gif_url} alt={result.name} />
      <div className="mt-2">
        <p className="font-semibold text-lg">{result.name}</p>
        {result.upload_by && <p className="text-sm">@{result.upload_by}</p>}
      </div>
    </li>
  );
};

export default FavItem;
