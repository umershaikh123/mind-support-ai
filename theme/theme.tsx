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
    primary: "#4AA8FF",
    secondary: "#030408",
    background: "#000000",
     
    chatBackground: "#060A16",

    border: "#2161C0",
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

// Define your custom theme
const theme = createTheme({
  palette: {
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

export { theme, colorSchemes }
