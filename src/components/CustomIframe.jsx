// import { createPortal } from "react-dom";
import { useEffect } from "react";
import { Container } from "@mui/material";

export default function CustomIframe({ children, hrefs, ...props }) {
  // const [contentRef, setContentRef] = useState(null);
  // const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    const iframe = document.getElementById("resume");
    const createLink = (href) =>
      Object.assign(document.createElement("link"), {
        href: href,
        rel: "stylesheet",
        type: "text/css",
      });

    (hrefs ?? []).forEach((href) => {
      iframe?.contentWindow?.document?.head?.append(createLink(href));
    });
    return () => {};
  }, [hrefs]);

  const containerStyle = {
    width: "100%",
    background: (theme) => theme.palette.background.paper,
  };

  return (
    <div id="resume-container">
      <Container
        // ref={setContentRef}
        title="resume"
        id="resume"
        width="100%"
        sx={containerStyle}
      >
        {children}
        {/* {mountNode && createPortal(children, mountNode)} */}
      </Container>
    </div>
  );
}
