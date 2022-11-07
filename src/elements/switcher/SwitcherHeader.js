import React, { useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';


const SwitcherHeader = () => {

    useEffect(() => {
        const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if(colorMode){
            document.querySelector('body').classList.add("active-dark-mode");
        }
    }, []);
  
    const switchColor = () => {
        document.querySelector('body').classList.toggle("active-dark-mode");
    }

    return (
        
        <button onClick={switchColor}>
            <span className="setColor dark"><FaSun />Light mode</span>
            <span className="setColor light"><FaMoon />Dark mode</span>
        </button>
       
    )
}

export default SwitcherHeader;