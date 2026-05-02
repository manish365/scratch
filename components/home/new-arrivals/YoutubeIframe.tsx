import React from "react";

function YoutubeIframe({ url }: { url: string }) {
  return (
    <iframe
      width="496"
      height="346"
      src={`https://www.youtube.com/embed/${url}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube video"
    />
  );
}

export default YoutubeIframe;
