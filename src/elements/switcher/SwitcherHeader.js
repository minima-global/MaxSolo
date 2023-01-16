import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoonIcon, SunIcon } from '../icons/MaxSoloIcons';

const SwitcherHeader = () => {

    const [switchMode, setSwitchMode] = useState('Light mode');

    const storeMode = async (value) => {
        try {
          await AsyncStorage.setItem("mode", JSON.stringify(value));
        } catch (error) {
          console.log(error);
        }
    };

    // const removeData = async () => {
    //     try {
    //         const savedMode = await AsyncStorage.clear();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        const getMode = async () => {
            try {
                const modeData = JSON.parse(await AsyncStorage.getItem("mode"))
                // console.log('Theme mode: ' + modeData);
                if(modeData === null){
                    const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    if(colorMode){
                        document.querySelector('body').classList.add("active-dark-mode");
                        setSwitchMode('Dark mode');
                    }
                }
                if(modeData === 'Light mode'){
                    document.querySelector('body').classList.remove("active-dark-mode");
                    setSwitchMode('Light mode');
                }else{
                    document.querySelector('body').classList.add("active-dark-mode");
                    setSwitchMode('Dark mode');
                }
            } catch (error) {
                console.log(error); 
            }
        };
        
        getMode();

    }, []);
  
    const switchColor = () => {
        if(switchMode === 'Light mode'){
            document.querySelector('body').classList.add("active-dark-mode");
            setSwitchMode('Dark mode');
            storeMode('Dark mode'); 
        }else{
            document.querySelector('body').classList.remove("active-dark-mode");
            setSwitchMode('Light mode');
            storeMode('Light mode'); 
        }
    }

    return (
        <>
            <div onClick={switchColor} className = {`maxsolo-sidebar-menu-item-tab`}>
                {switchMode === "Dark mode" ? (<><SunIcon/> Light mode</>) : (<><MoonIcon/> Dark mode</>)}
            </div>
            {/* <div onClick={removeData}>Remove</div> */}
        </>
    )
}

export default SwitcherHeader;