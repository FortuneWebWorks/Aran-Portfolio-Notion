import { createContext, useContext, useState } from 'react';

// Create Context object.
const CutterContext = createContext();

// Export Provider.
export default function CutterProvider({ children }) {
  const [images, setImages] = useState([]);

  const output = { images, setImages };

  return (
    <CutterContext.Provider value={output}>{children}</CutterContext.Provider>
  );
}

// Export useContext Hook.
export function useCutterContext() {
  return useContext(CutterContext);
}
