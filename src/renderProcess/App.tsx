import React from "react";
import "./App.css";
import { styled } from "styled-components";
import { Dropdown } from "./components/Dropdown";
import { VideoMetadata, VideoTypes } from "../types/video";

export function App() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);
  const [viewLibrary, setViewLibrary] = React.useState(false);
  const [isPlayback, setPlayback] = React.useState(false);
  const [selectedVideo, setSelection] = React.useState(false);

  const [mediaLibrary, setLibrary] = React.useState<VideoMetadata[]>(null);
  const [mimeContainer, setMIME] = React.useState<VideoTypes>("webm");

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<HTMLVideoElement>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const handlePreferredFormat = (value: VideoTypes) => {
    setMIME(value);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (streamRef.current) {
        streamRef.current.srcObject = stream;
      }
      setLoaded(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setIsError(true);
    }
  };

  const handleStartStopRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      const stream = streamRef.current.srcObject as MediaStream;
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
        sendVideoToElectron(blob);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  const sendVideoToElectron = (videoBlob: Blob) => {
    videoBlob.arrayBuffer().then((buffer) => {
      window.electron.saveVideo(buffer, mimeContainer);
    });
  };

  const getLibrary = async () => {
    const videos = await window.electron.getLibraryMetadata();
    setLibrary(videos);
  };

  React.useEffect(() => {
    if (!mediaLibrary) getLibrary();
    startWebcam();
  }, []);

  // TODO: set up ask camera permission function using navigator.mediaDevices to add into ErrorView as button
  return (
    <AppWrapper>
      {isLoaded && (
        <video
          autoPlay
          muted
          playsInline
          style={{ width: "100%" }}
          ref={streamRef}
        />
      )}
      {isError && (
        <ErrorView>
          <p>Cannot Find Webcam</p>
        </ErrorView>
      )}
      <ControlPanel>
        <LibraryView $isVisible={viewLibrary}>
          {mediaLibrary &&
            mediaLibrary.map((item) => (
              <img height="100%" width="auto" src={item.thumbnail} />
            ))}
        </LibraryView>
        <FlexRowContainer>
          <div>
            <button onClick={() => setViewLibrary((prevView) => !prevView)}>
              view library
            </button>
          </div>
          <div>
            <RecordButton
              style={isRecording ? { backgroundColor: "red" } : {}}
              onClick={handleStartStopRecording}
            >
              Rec
            </RecordButton>
          </div>
          <div>
            <Dropdown
              options={["webm", "mp4", "mkv"]}
              onSelect={handlePreferredFormat}
            />
          </div>
        </FlexRowContainer>
      </ControlPanel>
    </AppWrapper>
  );
}

const LibraryView = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  height: 80px;
  width: 100%;
  background-color: darkgray;
  display: flex;
  gap: 4px;
  padding: 8px;
  overflow: auto;
  transform: ${({ $isVisible }) => ($isVisible ? "scaleY(0)" : "scaleY(1)")};
  transform-origin: bottom;
  transition: transform 0.3s ease-out;
`;

const RecordButton = styled.button`
  height: 70px;
  width: 70px;
  border-radius: 100%;
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

const ControlPanel = styled.footer`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 100px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
`;
