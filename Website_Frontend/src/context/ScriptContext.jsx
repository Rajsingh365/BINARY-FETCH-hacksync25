import { createContext,useContext,useState } from "react";


export const ScriptContext = createContext();

export const useScriptContext = () => {
  return useContext(ScriptContext);
}

export const ScriptContextProvider = ({children}) => {
  const [textScript, setTextScript] = useState("");
  
  return <ScriptContext.Provider value={{textScript, setTextScript}}>
    {children}
    </ScriptContext.Provider>;
}