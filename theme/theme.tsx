import { createTheme, SimplePaletteColorOptions } from "@mui/material/styles"
import { PaletteColorOptions } from "@mui/material/styles/createPalette"


 

// Define a type alias for PaletteColorOptions
type CustomPaletteColorOptions = SimplePaletteColorOptions & {
  main?: string
}

declare module "@mui/material/styles" {
  interface Palette {
    customScheme: CustomPaletteColorOptions
    chatBackground: CustomPaletteColorOptions
    border: CustomPaletteColorOptions
  }
  interface PaletteOptions {
    customScheme?: CustomPaletteColorOptions
    chatBackground?: CustomPaletteColorOptions
    border?: CustomPaletteColorOptions
  }
}

// Define your color schemes
const colorSchemes = [
  {
    name: "Default",
    primary: "#0097d3",
    secondary: "#ffffff",
    background: "#000000",
    chatBackground: "#0097d3",
    border: "#7aa895",
  },
  {
    name: "Hacker",
    primary: "#40FF53",
    secondary: "#020703",
    chatBackground: "#060C06",
    border: "#01FFA4",
  },
  {
    name: "Blue",
    primary: "#00A3FF",
    secondary: "#020307",
    chatBackground: "#06070C",
    border: "#00D1FF",
  },
]
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colorSchemes[0].primary,
    },
    secondary: {
      main:  "#121212",
    },
  },

})

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colorSchemes[0].primary,
    },
    secondary: {
      main: colorSchemes[0].secondary,
    },
    background: {
      default: colorSchemes[0].background,
    },
    chatBackground: {
      main: colorSchemes[0].chatBackground,
    },

    border: {
      main: colorSchemes[0].border,
    },
  },
})


// Define your custom theme
const theme = createTheme({
  palette: {
    mode: "light",
    // Set the default color scheme
    primary: {
      main: colorSchemes[0].primary,
    },
    secondary: {
      main: colorSchemes[0].secondary,
    },
    background: {
      default: colorSchemes[0].background,
    },
    chatBackground: {
      main: colorSchemes[0].chatBackground,
    },

    border: {
      main: colorSchemes[0].border,
    },
  },
})



export { theme, darkTheme, lightTheme, colorSchemes }
