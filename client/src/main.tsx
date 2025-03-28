import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import fonts
const fontLinks = document.createElement('link');
fontLinks.rel = 'stylesheet';
fontLinks.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap';
document.head.appendChild(fontLinks);

// Import font awesome
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

createRoot(document.getElementById("root")!).render(<App />);
