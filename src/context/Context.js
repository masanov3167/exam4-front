import React, { useState} from 'react';

const Context = React.createContext();

const Provider = ({ children }) => {

    function chunkSubstr(str) {
        const test = str.toString().trim().split('').reverse().join('');
        const numChunks = Math.ceil(test.length / 3)
        const chunks = new Array(numChunks)
      
        for (let i = 0, o = 0; i < numChunks; ++i, o += 3) {
          chunks[i] = test.substr(o, 3)
        }
      
        return chunks.map(a =>a.split('').reverse().join('')).reverse().join(' ')
      }

	const [lang ,setLang] = useState(JSON.parse(window.localStorage.getItem("lang")) || false)
    const link = '';
    const defaultLang = 'uz';
	
	React.useEffect(() => {
        if(lang){
            window.localStorage.setItem("lang", JSON.stringify(lang))
        }
        else{
            window.localStorage.removeItem('lang')
        }
    }, [lang])

	return (
		<Context.Provider value={{lang ,setLang, link, chunkSubstr, defaultLang}}>{children}</Context.Provider>
	);
};

export { Context, Provider };