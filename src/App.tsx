import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { FileValidator } from './FileValidator';

declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
      downlinkMax?: number;
      rtt?: number;
      saveData?: boolean;
    };
    deviceMemory?: number;
    hardwareConcurrency?: number;
  }
}

function App() {

  const smallVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
  const midVideo = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4";
  const largeVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const [videoSrc, setVideoSrc] = useState(smallVideo);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgColor, setMsgColor] = useState<string | null>(null);

  // useEffect(() => { setInterval(setVideo, 100); }, []);

  function setVideo() {
    const memory = navigator.deviceMemory ?? 0;
    const cpuCores = navigator.hardwareConcurrency ?? 0;
    const connectionType = navigator.connection?.effectiveType ?? "4g";

    if (memory < 4 || cpuCores <= 2 || connectionType === "2g" || connectionType === "3g") {
      setVideoSrc(smallVideo);
      sentMsg(smallVideo);
    }
    else if (memory >= 4 && cpuCores >= 4) {
      setVideoSrc(largeVideo);
      sentMsg(largeVideo);
    }
    else {
      setVideoSrc(midVideo);
      sentMsg(midVideo);
    }
  }

  function handleVideoPlay() {
    sentMsg(videoSrc);
  }

  function videoChange(url: string) {
    setVideoSrc(url);
    sentMsg(url);
  }

  function sentMsg(data: string) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(data);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/png'];

      try {
        await FileValidator.validateFileContent(selectedFile, allowedTypes);
        setMsg("File is accepted.");
        setMsgColor('green');
      } catch (validationError) {
        setMsg(`${validationError}`);
        setMsgColor('red');
      }
    }
  };

  return (
    <main className="container py-4" role="main" aria-label="Main Content" style={{ overflowX: "hidden" }}>

      <header
        className="mb-4 d-flex align-items-center justify-content-center"
        role="banner"
        aria-label="Page Header"
        style={{ backgroundColor: "#e8f7e7", borderRadius: "8px", height: "8rem" }}
      >
        <h1
          className="text-center mb-3 text-success"
          id="page-title"
          style={{ fontSize: "2.5rem" }}
          tabIndex={0}
          aria-label="React with TypeScript Title"
        >
          React with TypeScript
        </h1>
      </header>

      <div className="d-flex justify-content-center mt-4">
        <a
          href="#footer"
          className="btn btn-success"
          style={{ fontSize: "1rem" }}
          role="button"
          aria-label="Navigate to the footer section of the page"
        >
          Go to Bottom
        </a>
      </div>

      <div className="d-flex flex-column gap-1 justify-content-center align-items-center mt-4">
        {/*<button className="btn btn-warning" onClick={() => videoChange(smallVideo)}>Small</button>*/}
        {/* <button className="btn btn-warning" onClick={() => videoChange(midVideo)}>Mid</button> */}
        {/* <button className="btn btn-warning" onClick={() => videoChange(largeVideo)}>Large</button> */}

        {/* <input type="file" accept=".png, .pdf" onChange={handleFileChange} /> */}
        <input type="file" onChange={(e) => handleFileChange(e)} />
        {msg && <p style={{ color: `${msgColor}`, fontWeight: 'bold' }}>{msg}</p>}

      </div>

      <section
        id="info"
        aria-labelledby="info-heading"
        role="region"
        aria-label="About React with TypeScript"
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
      >
        <h2
          className="h3 text-success"
          id="info-heading"
          style={{ fontSize: "2rem", textAlign: "center" }}
          tabIndex={0}
          aria-label="About React with TypeScript Section"
        >
          About React with TypeScript
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
            padding: "0 1rem",
          }}
          tabIndex={0}
          aria-label="Introduction to React with TypeScript"
        >
          React is a powerful JavaScript library used for building user interfaces, especially for
          single-page applications (SPAs). When combined with TypeScript, it brings type safety,
          better tooling, and improved developer experience.
        </p>

        <h2
          className="h3 text-success"
          id="react-typescript-heading"
          style={{ fontSize: "2rem", textAlign: "center" }}
          tabIndex={0}
          aria-label="Key Features Section Title"
        >
          Key Features of React with TypeScript
        </h2>

        <div
          className="d-flex gap-5 justify-content-center align-items-center flex-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <ul
            className="list-group"
            role="list"
            aria-labelledby="react-typescript-heading"
            aria-label="List of key features of React with TypeScript"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "0 1rem",
            }}
          >
            {[
              {
                id: "type-safety",
                title: "Type Safety",
                description: "TypeScript provides static type checking, ensuring that your code is free from type-related errors.",
              },
              {
                id: "dev-tooling",
                title: "Improved Developer Tooling",
                description: "TypeScript provides autocompletion, type inference, and inline documentation for a better development process.",
              },
              {
                id: "refactoring",
                title: "Better Refactoring",
                description: "TypeScript makes refactoring safer by ensuring changes do not break other parts of the application.",
              },
              {
                id: "react-props",
                title: "React Types for Props and State",
                description: "TypeScript allows you to define types for props and state in React components, improving maintainability.",
              },
              {
                id: "js-integration",
                title: "Integration with Existing JavaScript Code",
                description: "TypeScript works seamlessly with JavaScript, allowing smooth migration of codebases.",
              },
            ].map((feature) => (
              <li
                key={feature.id}
                id={feature.id}
                className="list-group-item"
                role="listitem"
                aria-labelledby={`${feature.id}-title`}
                style={{
                  backgroundColor: "#d9f7d9",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                  fontSize: "1rem",
                }}
                tabIndex={0}
                aria-label={`Feature: ${feature.title}`}
              >
                <strong id={`${feature.id}-title`} aria-label={`${feature.title} Label`}>
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>

          <div
            style={{
              width: "90%",
              maxWidth: "500px",
              height: "auto",
            }}
          >
            <video
              key={videoSrc}
              // onPlay={handleVideoPlay}
              controls
              preload="auto"
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                objectFit: "cover",
              }}
            >
              <source src={videoSrc} type="video/mp4; codecs=avc1.42E01E, mp4a.40.2" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <p
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
            padding: "0 1rem",
          }}
          tabIndex={0}
          aria-label="Conclusion about React with TypeScript"
        >
          By integrating TypeScript with React, you can significantly improve the quality,
          maintainability, and scalability of your applications.
        </p>
      </section>

      <div className="d-flex justify-content-center mt-4">
        <a
          href="#page-title"
          className="btn btn-success"
          style={{ fontSize: "1rem" }}
          role="button"
          aria-label="Return to the top of the page"
        >
          Go to Top
        </a>
      </div>

      <footer
        id="footer"
        className="mt-5"
        role="contentinfo"
        aria-label="Page Footer"
        style={{ backgroundColor: "#e8f7e7", padding: "2rem", borderRadius: "8px" }}
      >
        <aside role="complementary" aria-label="Contact Information">
          <h3
            className="text-success"
            style={{ fontSize: "1.5rem" }}
            tabIndex={0}
            aria-label="Contact Information Header"
          >
            Contact Info
          </h3>
          <p
            style={{ fontSize: "1.1rem" }}
            tabIndex={0}
            aria-label="Contact email information"
          >
            If you have any questions, feel free to reach out to us at{" "}
            <a
              href="mailto:contact@company.com"
              className="link-success"
              aria-label="Send email to contact@company.com"
              style={{ fontSize: "1.1rem" }}
            >
              contact@company.com
            </a>.
          </p>
        </aside>
      </footer>
    </main>
  );
}

export default App;