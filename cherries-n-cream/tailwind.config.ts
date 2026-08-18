import type { Config } from "tailwindcss";

// Cherries N' Cream — paletta: mély bordó ("cseresznye") + meleg krém,
// éjplum háttér a diszkrét, elegáns, "boutique" hangulathoz —
// tudatosan NEM a szokásos neon/rikító szexshop-esztétika.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: "#211018",       // fő sötét háttér
        cherry: "#7A1F3D",     // elsődleges akcent (mély cseresznye)
        cherryLight: "#A8355A",
        cream: "#F6ECE1",      // fő világos szín / szöveg sötét háttéren
        blush: "#D9B3A8",      // másodlagos akcent, halvány
        ink: "#160B10",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        soft: "0.35rem",
      },
    },
  },
  plugins: [],
};
export default config;
