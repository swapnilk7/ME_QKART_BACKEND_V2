import React from "react";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="pageNotFoundDiv">
      <div class="number">404</div>
      <div class="text">
        <span>Ooops...</span>
        <br />
        page not found
      </div>
    </div>
  );
};

export default PageNotFound;
