import React, { useState, useEffect } from "react";
import ChatWindow from "../component/chat/ChatWindow";
import WelcomeMaxSolo from "../component/welcome/WelcomeMaxSolo";
import WelcomeLogo from "../component/welcome/WelcomeLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logoimage from "../assets/images/maxsolo_blue_logo.svg";

const DashBoard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [howItWorks, setHowItWorks] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const appData = await AsyncStorage.getItem("isAppFirstLaunched");
      if (appData == null) {
        setIsAppFirstLaunched(true);
        AsyncStorage.setItem("isAppFirstLaunched", "false");
      } else {
        setIsAppFirstLaunched(false);
      }
    }
    fetchData();
    // AsyncStorage.removeItem('isAppFirstLaunched');
  }, []);

  const WelcomeHandler = () => {
    setShowWelcome(false);
  };

  const HowItWorks = () => {
    setHowItWorks(!howItWorks);
  };

  useEffect(() => {
    setTimeout(function () {
      setShowLogo(false);
    }, 2100);
  }, []);

  const WelcomeButton = () => {
    return (
      <>
        <div className="section-heading welcome-button">
          <button
            data-testid="start-chat-button"
            onClick={WelcomeHandler}
            className="minima-btn btn-fill-blue-medium"
          >
            Start chatting
          </button>
          <button
            onClick={HowItWorks}
            className="minima-btn btn-fill-black-medium"
          >
            How it works
          </button>
        </div>
        {howItWorks ? (
          <div className="how-it-works">
            <div className="maxsolo-logotype">
              <img className="light-version-logo" src={Logoimage} alt="logo" />
            </div>
            <div className="section-heading heading-left">
              <h2 className="title">How it works</h2>
              <div>
                Experience freedom of information
                <br />
                <br />
                MaxSolo is an encrypted, peer-to-peer messaging application,
                which uses Minima’s information transfer layer, Maxima.
                <br />
                <br />
                <ul>
                  <li>Send messages and images</li>
                  <li>Transfer Minima, tokens and NFTs</li>
                  <li>Experience freedom of information</li>
                </ul>
              </div>
              <div className="section-heading welcome-button">
                <button
                  onClick={WelcomeHandler}
                  className="minima-btn btn-fill-blue-medium"
                >
                  Start chatting
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <>
      <main className="app">
        {isAppFirstLaunched && showLogo ? <WelcomeLogo /> : null}
        {isAppFirstLaunched && showWelcome ? (
          <WelcomeMaxSolo />
        ) : (
          <ChatWindow />
        )}
        {isAppFirstLaunched && showWelcome ? <WelcomeButton /> : null}
      </main>
    </>
  );
};

export default DashBoard;
