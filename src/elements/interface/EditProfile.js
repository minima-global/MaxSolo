import React, { useState, useRef } from "react";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { BackIcon, CopyIcon } from "../icons/MaxSoloIcons";

const EditProfile = ({
  isSelectedTab,
  setSelectedTab,
  responseName,
  responseContact,
  restartContacts,
}) => {
  const [infoCopyText, setInfoCopyText] = useState("");
  const [infoNotifyText, setInfoNotifyText] = useState("");
  const [butActive, setButActive] = useState("");
  const setProfileRef = useRef(null);

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(responseContact);
    setInfoCopyText("Copied to clipboard!");
    setTimeout(() => {
      setInfoCopyText("");
    }, 3000);
  };

  const handleOnChange = (event) => {
    const value = event.target.value;
    setButActive(value);
  };

  const setProfile = () => {
    if (setProfileRef.current.value === "") {
      setSelectedTab(0);
      return;
    } else {
      var specialChars = /[^a-zA-Z0-9 ]/g;
      if (setProfileRef.current.value.match(specialChars)) {
        setInfoNotifyText(
          "Only alphanumeric characters are allowed. Do not use spaces."
        );
        setTimeout(() => {
          setInfoNotifyText("");
        }, 3000);
        return;
      }
      const setprofile =
        "maxima action:setname name:" + setProfileRef.current.value + "";
      window.MDS.cmd(setprofile, function (resp) {
        // console.log(resp)
        if (resp.status) {
          setProfileRef.current.value = "";
          restartContacts();
          setSelectedTab(0);
        } else {
          setInfoNotifyText("Could not update name.");
          setTimeout(() => {
            setInfoNotifyText("");
          }, 3000);
        }
      });
    }
  };

  return (
    <div
      className={`maxsolo-sidebar-container ${
        isSelectedTab === 1 ? "active" : ""
      }`}
    >
      <div className="maxsolo-sidebar-container-button" onClick={setProfile}>
        <BackIcon /> Edit profile
      </div>
      <div className="maxsolo-sidebar-container-content">
        <div className="main-title">Display Name</div>
        <input
          type="text"
          placeholder={responseName}
          onChange={handleOnChange}
          ref={setProfileRef}
          className={`${infoNotifyText ? "error" : ""}`}
          tabIndex="-1"
          onKeyDown={(e) => {
            if (e.keyCode === 9) e.preventDefault();
          }}
        />
        <div className="info-input">{infoNotifyText}</div>
        <div className="contact-form-button">
          <button
            onClick={setProfile}
            className={`minima-btn btn-fill-blue-medium ${
              butActive ? "" : "notactive"
            }`}
          >
            Save
          </button>
        </div>
        <div className="maxsolo-sidebar-container-content-address">
          <div className="maxsolo-sidebar-container-content-address-header">
            <div className="title">My Address</div>
            <div className="copy-button" onClick={copyToClipboard}>
              {infoCopyText ? (
                <FaCheckCircle className="check" />
              ) : (
                <CopyIcon />
              )}
            </div>
          </div>
          <div className="display-address">{responseContact}</div>
        </div>
        <div className="info-message">{infoCopyText}</div>
        <div className={`maxsolo-sidebar-notification info-sidebar`}>
          <div className="maxsolo-sidebar-notification-icon">
            <FaInfoCircle />
          </div>
          <div className="maxsolo-sidebar-notification-content">
            <span className="copy">
              Send your address to others to start chatting. Please note that
              your address changes roughly every 12 hours.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
