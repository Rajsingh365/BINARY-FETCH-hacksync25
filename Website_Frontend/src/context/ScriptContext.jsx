import { createContext,useContext,useState } from "react";

export const ScriptContext = createContext();

export const useScriptContext = () => {
  return useContext(ScriptContext);
}

export const ScriptContextProvider = ({children}) => {
  const [textScript, setTextScript] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  
  return <ScriptContext.Provider value={{textScript, setTextScript,audioFile, setAudioFile}}>
    {children}
    </ScriptContext.Provider>;
}