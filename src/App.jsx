import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";

import { toBlob, toPng } from "html-to-image";
import { useRef, useState } from "react";

import Alert from "./components/Alert";
import { UnControlled as CodeMirror } from "react-codemirror2";

const examples = {
  htmlmixed: `<div>
  <h1>Hello world</h1>
</div>`,
  css: `div {
  display: flex;
  justify-content: center;
}`,
  javascript: `let x = 5;
let y = 2;
let z = x + y;
document.body.innerHTML = z;`,
};

export default function App() {
  const containerRef = useRef();

  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleCopy = () => {
    setLoading(true);

    toBlob(containerRef.current).then((blob) => {
      navigator.clipboard
        .write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ])
        .then(() => {
          setAlertText("Image copied to clipboard!");
        })
        .catch((err) => {
          console.log(err);
          setAlertText(`Failed to copy! ${err.message || ""}`);
        })
        .finally(() => {
          setLoading(false);
          setIsAlertOpened(true);
        });
    });
  };

  const handleDownload = () => {
    setLoading(true);

    toPng(containerRef.current, { quality: 1 })
      .then((data) => {
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = `codesnap-${language}.png`;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      })
      .catch((err) => {
        console.log(err);
        setAlertText("Failed to download!");
        setIsAlertOpened(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-[#00000080] z-[99999] flex justify-center items-center transition-all duration-500 ${
          loading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-10 h-10 border-[3px] border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center py-4">
        <div className="w-screen max-w-[500px] flex flex-col items-stretch gap-4">
          <div ref={containerRef} className="bg-[#ADD8E6] p-[15px]">
            <div className="rounded-xl overflow-hidden p-[10px] bg-[#212121] gap-[15px] flex flex-col items-stretch">
              <div className="flex gap-[5px]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C840]"></div>
              </div>
              <CodeMirror
                value={examples[language]}
                options={{
                  mode: language,
                  theme: "material-darker",
                  viewportMargin: Infinity,
                  lineWrapping: true,
                  lineNumbers: false,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-stretch flex-wrap gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="outline-none bg-[#222] px-3 py-2 rounded"
            >
              <option value="htmlmixed">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">Javascript</option>
            </select>

            <div className="flex items-stretch gap-2">
              <button
                onClick={handleCopy}
                className="bg-[#222] px-3 h-9 rounded hover:brightness-125 transition duration-300"
              >
                <i className="fas fa-copy"></i>
                <span> Copy</span>
              </button>

              <button
                onClick={handleDownload}
                className="bg-[#222] px-3 h-9 rounded hover:brightness-125 transition duration-300"
              >
                <i className="fas fa-download"></i>
                <span> Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
      />
    </>
  );
}
