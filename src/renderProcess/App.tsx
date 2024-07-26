import React from "react";
import "./App.css";
import { styled } from "styled-components";
import { Dropdown } from "./components/Dropdown";

export function App() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isLoaded, setLoaded] = React.useState(false);
  const [viewLibrary, setViewLibrary] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const handlePreferredFormat = (value: string) => {
    console.log("Selected:", value);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const chunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        // TODO: send url to backend
      };
      setLoaded(true);
      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      setIsError(true);
    }
  };

  React.useEffect(() => {
    startWebcam();
  }, []);

  // TODO: set up ask camera permission function using navigator.mediaDevices to add into ErrorView as button
  return (
    <AppWrapper>
      {isLoaded && (
        <video
          autoPlay
          muted
          style={{ width: "100%" }}
          ref={(videoElement) => {
            if (videoElement && streamRef.current) {
              videoElement.srcObject = streamRef.current;
            }
          }}
        />
      )}
      {isError && (
        <ErrorView>
          <p>Cannot Find Webcam</p>
        </ErrorView>
      )}
      <ControlPanel>
        {viewLibrary && <LibraryView />}
        <FlexRowContainer>
          <div>
            <button onClick={() => setViewLibrary((prevView) => !prevView)}>
              view library
            </button>
          </div>
          <div>
            <RecordButton
              style={isRecording ? { backgroundColor: "red" } : {}}
              onClick={() => setIsRecording((prevRecording) => !prevRecording)}
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

const LibraryView = styled.div`
  height: 50px;
  width: 100%;
  background-color: lightgray;
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
