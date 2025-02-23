import { createContext,useContext,useState } from "react";


export const ScriptContext = createContext();

export const useScriptContext = () => {
  return useContext(ScriptContext);
}

export const ScriptContextProvider = ({children}) => {
  const [textScript, setTextScript] = useState("");
  const [tags, setTags] = useState("")
  
  return <ScriptContext.Provider value={{textScript, setTextScript, tags, setTags}}>
    {children}
    </ScriptContext.Provider>;
}