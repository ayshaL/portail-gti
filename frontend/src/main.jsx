import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const styles = {
  body: {
    margin: 0,
    minWidth: 320,
    background: "#f5f6f8",
    color: "#1d2939",
    fontFamily: '"DM Sans", sans-serif',
  },
};

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap";
document.head.appendChild(fontLink);

document.body.style.margin = `${styles.body.margin}`;
document.body.style.minWidth = `${styles.body.minWidth}px`;
document.body.style.background = styles.body.background;
document.body.style.color = styles.body.color;
document.body.style.fontFamily = styles.body.fontFamily;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// export const theme = {
//   primary: "#E8451D",
//   white: "#FFFFFF",
//   darkBlue: "#1C3F76",
//   lightBlue: "#BADDEA",
//   sand: "#DBBF9D",
//   brown: "#AE7833",
//   ice: "#DAECEF",
//   teal: "#6FCDCB"
// };
