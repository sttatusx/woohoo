import styles from "./App.module.css";
import Title from "../Components/Title";
import { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg();

function App() {
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState();
  const [video, setVideo] = useState();
  const [title, setTitle] = useState();
  const [gif, setGif] = useState();
  

  useEffect(() => {
    setTitle("Woohoo");
    setSummary("Convert your video file to gif just by 2 clicks!");

    const load = async () => {
      await ffmpeg.load();
      setReady(true);
    };

    load();
  }, []);

  const getVideoFromUser = (event) => {
    setVideo(event.target.files?.item(0));

    setTitle("Video preview");
    setSummary("Lorem ipsum dolor sit amet consecteturum pariatur quis volupt");
  };

  const convertToGif = async () => {
    if (!video) return;

    ffmpeg.FS("writeFile", "video.mp4", await fetchFile(video));
    
    // start the process
    await ffmpeg.run("-i", "video.mp4", "-t", "2.5", "-ss", "2.0", "-f", "gif", "out.gif");

    // read the file
    const data = ffmpeg.FS("readFile", "out.gif");

    // create url
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: "image/gif",
    });
    setGif(url);

    setTitle("Result");
    setSummary("Lorem ipsum dolor sit amet consecteturum pariatur quis volupt");
  };

  return (
    <section className={styles.App}>
      <div className={styles.TitleBox}>
        <Title title={title} summary={summary} />
      </div>

      { video && !gif && (
        <video
          src={URL.createObjectURL(video)}
          controls
          className={styles.VideoPreview}
        ></video>
      )}

      { gif &&
        <img src={gif} className={styles.VideoPreview} />
      }

      { !gif && (
        <div className={styles.ButtonWrapper}>
          {!video || gif ? (
            <label htmlFor="video-picker" className={styles.FileInputLabel}>
              <input
                type="file"
                id="video-picker"
                onChange={getVideoFromUser}
                accept=".mp4"
              />
              Upload video file
            </label>
          ) : (
            <button onClick={convertToGif} disabled={!ready} className={styles.PrimaryButton}>
              Convert
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default App;
