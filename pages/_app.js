import '../styles/globals.css'
import  {AppContext}    from '../utils/context'
import { ThemeProvider } from "@material-tailwind/react";
function MyApp({ Component, pageProps }) {

  return (
    <AppContext>
   <ThemeProvider>
      <Component {...pageProps} />
      </ThemeProvider>
    </AppContext>
  )
}

export default MyApp
