// routes
import { useEffect } from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

import { GlobalDebug } from './utils/RemoveConsoles';

// ----------------------------------------------------------------------

export default function App() {

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'STAGING') {
      GlobalDebug(false);
    }
  }, []);
  
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
