import { purple, grey, indigo, yellow, red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const baseTheme = {
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },

    background: {
      paper: "#fff",
      default: "#fff",
    },
  },

  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),

    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },

  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },

    MuiTypography: {
      variant: [
        {
          props: { variant: "description" },
          style: {
            color: grey[200],
            fontWeight: 300,
            textShadow: "2px 2px black",
          },
        },
      ],
    },
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
};

const lightTheme = {
  palette: {
    mode: "light",

    primary: {
      main: purple[700],
      contrastText: grey[200],
      hover: purple[900],
      table: purple["A700"],
    },

    secondary: {
      main: indigo[700],
      hover: indigo[100],
      contrastText: grey[700],
      table: indigo[300],
    },

    toggleIcon: {
      main: red[400],
      hover: grey[450],
    },

    text: {
      primary: "rgba(0,0,0,0.87)",
      secondary: "rgba(0,0,0,0.6)",
      disabled: "rgba(0,0,0,0.38)",
      icon: "rgba(0,0,0,0.12)",
    },

    background: {
      table: grey[200],
      paper: "#fff",
      default: "#fff",
    },

    divider: "rgba(0,0,0,0.12)",
  },
};

const darkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: purple[800],
      hover: purple["A700"],
      contrastText: purple[50],
      table: purple[900],
    },

    secondary: {
      main: indigo[800],
      hover: indigo[200],
      table: indigo["A100"],
    },

    toggleIcon: {
      main: yellow[400],
      hover: grey[450],
    },

    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
      icon: "rgba(0, 124, 255, 0.12)",
    },

    background: {
      table: grey[200],
      paper: "#121212",
      default: "#121212",
    },

    divider: grey["A100"],
  },
};

export const themes = {
  base: baseTheme,
  light: lightTheme,
  dark: darkTheme,
};

function CustomThemeProvider({ children, startingTheme = "light" }) {
  const [mode, setMode] = useLocalStorage("theme", startingTheme);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [setMode]
  );

  const theme = useMemo(() => createTheme(themes.base, themes[mode]), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default CustomThemeProvider;
