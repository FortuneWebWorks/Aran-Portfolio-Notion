import '../styles/globals.css';
import CutterProvider from 'context/CutterContext';

function MyApp({ Component, pageProps }) {
  return (
    <CutterProvider>
      <Component {...pageProps} />
    </CutterProvider>
  );
}

export default MyApp;
