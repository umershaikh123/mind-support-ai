import { createTheme, SimplePaletteColorOptions } from "@mui/material/styles"
import { PaletteColorOptions } from "@mui/material/styles/createPalette"


// :root {

//   --primary : #4AA8FF;
//   --Secondary :#7aa895;
//   --background : #49a8ff;
//   --chat-background : #7aa895;
//   --border:#034c81;
//   --scrollbar-track-color: #f2f2f2;
//   --scrollbar-thumb-color: #888888;
// }


// body {
//   color: var(--primary);
//   background-color: var(--background);
// }

 

// /* Apply custom scrollbar styles */
// ::-webkit-scrollbar {
//   width: 5px;
//   height: 4px;
// }

// /* Track */
// ::-webkit-scrollbar-track {
//   background-color: var(--chat-background);
// }

// /* Thumb */
// ::-webkit-scrollbar-thumb {
//   background-color: var(--primary);
// }

// /* Handle hover */
// ::-webkit-scrollbar-thumb:hover {
//   background-color: rgb(63, 125, 152);
// }


// input::-webkit-input-placeholder {
//   color: inherit;
//   opacity: 1;
// }

// /* Remove webkit input speech button styles */
// input::-webkit-input-speech-button {
//   display: none;
// }

// /* Remove webkit search input styles */
// input::-webkit-search-decoration,
// input::-webkit-search-cancel-button,
// input::-webkit-search-results-button,
// input::-webkit-search-results-decoration {
//   display: none;
// }

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

//   interface Palette {
//     customScheme: PaletteColorOptions
//     chatBackground: PaletteColorOptions
//     border: PaletteColorOptions
//   }
//   interface PaletteOptions {
//     customScheme?: PaletteColorOptions
//     chatBackground?: PaletteColorOptions
//     border?: PaletteColorOptions
//   }
// }

// // Define your color schemes
// const colorSchemes = [
//   {
//     name: 'Default',
//     primary: '#FF4081',
//     secondary: '#070204',
//     background: '#000000',
//     // chatBackground: '#0D0609',
//     chatBackground: '#150A0E',

//     border: '#92294C',
//   },
//   {
//     name: 'Hacker',
//     primary: '#40FF53',
//     secondary: '#020703',
//     chatBackground: '#060C06',
//     border: '#01FFA4',
//   },
//   {
//     name: 'Blue',
//     primary: '#00A3FF',
//     secondary: '#020307',
//     chatBackground: '#06070C',
//     border: '#00D1FF',
//   },
// ]

// // Define your custom theme
// const theme = createTheme({
//   palette: {
//     // Set the default color scheme
//     primary: {
//       main: colorSchemes[0].primary,
//     },
//     secondary: {
//       main: colorSchemes[0].secondary,
//     },
//     background: {
//       default: colorSchemes[0].background,
//     },
//     chatBackground: {
//       main: colorSchemes[0].chatBackground,
//     },

//     border: {
//       main: colorSchemes[0].border,
//     },

//   },
// })

export { theme, darkTheme, lightTheme, colorSchemes }
