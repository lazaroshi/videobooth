import React from "react";
import { VideoTypes } from "../../types/video";
import { styled } from "styled-components";

type PlayerProps = {
  url: string;
  videoType: VideoTypes;
  exitPlayback: () => void;
};

export function VideoPlayer({ url, videoType, exitPlayback }: PlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      console.log(url);
      videoRef.current.src = url;
      videoRef.current.load();
    }
    // return () => {
    //   if (videoRef.current && videoRef.current.src.startsWith("blob:")) {
    //     URL.revokeObjectURL(videoRef.current.src);
    //   }
    // };
  }, [url]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        controls
        playsInline
        style={{ width: "100%" }}
      >
        <source src={url} type={`video/${videoType}`} />
      </video>
      <ExitPlaybackButton onClick={exitPlayback}>X</ExitPlaybackButton>
    </>
  );
}

const ExitPlaybackButton = styled.button`
  position: absolute;
  margin: 1rem;
  top: 0px;
  right: 0px;
  height: 20px;
  width: 20px;
`;
