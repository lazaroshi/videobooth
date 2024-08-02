import React from "react";
import { styled } from "styled-components";
import { Dropdown } from "./components/Dropdown";
import { VideoMetadata, VideoTypes } from "../types/video";
import { VideoPlayer } from "./components/VideoPlayer";
import {
  getVideoMetadataFromElectron,
  getVideoURLFromElectron,
  sendVideoToElectron,
} from "./services/electron";
import { IoVideocam } from "react-icons/io5";
import { MdOutlineVideoLibrary, MdVideoLibrary } from "react-icons/md";

export function App() {
  // state variables
  const [isRecording, setIsRecording] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);
  const [isPlayback, setPlayback] = React.useState(false);
  const [viewLibrary, setViewLibrary] = React.useState(false);

  // store variables
  const [mediaLibrary, setLibrary] = React.useState<VideoMetadata[] | null>(
    null
  );
  const [mimeContainer, setMIME] = React.useState<VideoTypes>("webm");
  const [videoData, setVideoData] = React.useState<string | null>(null);
  const [selectedMetadata, setSelection] = React.useState<VideoMetadata | null>(
    null
  );

  // handy refs
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setLoaded(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setIsError(true);
    }
  };

  const stopWebcam = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setLoaded(false);
    }
  };

  const handleToggleRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      if (streamRef.current) {
        const stream = streamRef.current;
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: `video/${mimeContainer}`,
          });
          sendVideoToElectron(blob, mimeContainer);
          chunksRef.current = [];
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      }
    }
  };

  const handlePreferredFormat = (value: VideoTypes) => {
    setMIME(value);
  };

  const handleViewLibraryItem = (event: React.MouseEvent<HTMLDivElement>) => {
    const selectedIndex = parseInt(
      (event.target as HTMLElement).getAttribute("data-libindex") ?? "-1"
    );
    if (mediaLibrary && selectedIndex >= 0) {
      const selectedVideo = mediaLibrary[selectedIndex];
      setSelection(selectedVideo);
      updateVideoSource(selectedVideo);
    }
  };

  const updateVideoSource = async (selectedMetadata: VideoMetadata) => {
    const newSrc = await getVideoURLFromElectron(
      selectedMetadata.name,
      selectedMetadata.type
    );
    setVideoData(newSrc);
    setPlayback(true);
  };

  const getLibrary = async () => {
    const videos = await getVideoMetadataFromElectron();
    setLibrary(videos);
  };

  React.useEffect(() => {
    if (!mediaLibrary) getLibrary();
    startWebcam();
  }, []);

  React.useEffect(() => {
    if (isPlayback) {
      stopWebcam();
    } else {
      startWebcam();
    }
  }, [isPlayback]);

  return (
    <AppWrapper>
      {isLoaded && !isPlayback && (
        <video
          autoPlay
          muted
          playsInline
          style={{ width: "100%" }}
          ref={videoRef}
        />
      )}
      {isPlayback && videoData && selectedMetadata && (
        <VideoPlayer
          url={videoData}
          videoType={selectedMetadata.type}
          exitPlayback={() => {
            setPlayback(false);
            setVideoData(null);
            startWebcam();
          }}
        />
      )}
      {isError && (
        <ErrorView>
          <p>Cannot connect to webcam. Are webcam permissions allowed?</p>
          <button onClick={startWebcam}>Try connecting again</button>
        </ErrorView>
      )}
      <ControlPanel>
        <LibraryView $isVisible={viewLibrary} onClick={handleViewLibraryItem}>
          {mediaLibrary &&
            mediaLibrary.map((item, index) => (
              <img
                key={`video_thumbnail_${item.name}`}
                height="100%"
                width="auto"
                src={item.thumbnail}
                data-libindex={index}
              />
            ))}
        </LibraryView>
        <FlexRowContainer>
          <FlexColumnContainer>
            <ViewLibraryButton
              id="toggle-library-btn"
              onClick={() => setViewLibrary((prevView) => !prevView)}
            >
              {viewLibrary ? (
                <MdVideoLibrary style={{ height: "24px", width: "24px" }} />
              ) : (
                <MdOutlineVideoLibrary
                  style={{ height: "24px", width: "24px" }}
                />
              )}
            </ViewLibraryButton>
            <ButtonLabel htmlFor="toggle-library-btn">
              {viewLibrary ? "Hide" : "Show"} Library
            </ButtonLabel>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <RecordButton
              style={isRecording ? { backgroundColor: "red" } : {}}
              onClick={handleToggleRecording}
            >
              <IoVideocam style={{ height: "24px", width: "24px" }} />
            </RecordButton>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <Dropdown
              options={["webm", "mp4", "mkv"]}
              onSelect={handlePreferredFormat}
            />
            <ButtonLabel htmlFor="toggle-rec-btn">Select Filetype</ButtonLabel>
          </FlexColumnContainer>
        </FlexRowContainer>
      </ControlPanel>
    </AppWrapper>
  );
}

const ViewLibraryButton = styled.button`
  border: none;
  background-color: transparent;
`;

const ButtonLabel = styled.label`
  font-family: Ariel, sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
`;

const LibraryView = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  height: 80px;
  width: 100%;
  background-color: darkgray;
  display: flex;
  gap: 8px;
  padding: 4px;
  overflow: auto;
  transform: ${({ $isVisible }) => ($isVisible ? "scaleY(1)" : "scaleY(0)")};
  transform-origin: bottom;
  transition: transform 0.3s ease-out;
`;

const RecordButton = styled.button`
  height: 70px;
  width: 70px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid darkgray;
`;

const AppWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: black;
`;

const ErrorView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;

  & > p {
    color: white;
  }
`;

const FlexRowContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const FlexColumnContainer = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-content: space-around;
  justify-content: center;
  padding: 0.5rem;
`;

const ControlPanel = styled.footer`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 100px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
`;
