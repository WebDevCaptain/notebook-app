import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  bundlingError: string;
}

const html = `
    <html>
      <head>
        <style>
          html {
            background-color: white;
          }
        </style>
      </head>
      <body>
        <div id='root'>
          You can use show() to print the output here
        </div>
        <script>
          const handleError = (err) => {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h3>Runtime Error: </h3> ' + err.message + '</div>';
              console.error(err)
          }

          window.addEventListener('message', event => {
            try {
              eval(event.data);
            } catch (err) {
                handleError(err);
            }
          }, false)

          window.addEventListener('error', event => {
            event.preventDefault();
            handleError(event.error);
          })

        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
        title="Code Preview"
      />

      {bundlingError && <div className="preview-error"> {bundlingError} </div>}
    </div>
  );
};

export default Preview;
