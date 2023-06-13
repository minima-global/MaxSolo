import React, { useState } from "react";
import packageJson from "../../../../package.json";
import { getTime } from "../../../utils";
import Avatar from "react-avatar";
import SwitcherHeader from "../../../elements/switcher/SwitcherHeader";
import LoaderSidebar from "../../../elements/loader/LoaderSidebar";
import EditProfile from "../../../elements/interface/EditProfile";
import AddContact from "../../../elements/interface/AddContact";
import {
  UserIcon,
  ShareIcon,
  HelpIcon,
  CheckIcon,
  BackIcon,
  CloseIcon,
  NewChat,
} from "../../../elements/icons/MaxSoloIcons";
import useIsMinimaBrowser from "../../../hooks/useIsMinimaBrowser";

const SideBar = ({
  restartChatContacts,
  getPublicKey,
  contacts,
  lastMessage,
  restartContacts,
  responseContact,
  responseName,
}) => {
  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChatContacts, setIsChatContacts] = useState(false);
  const [isSelectedTab, setSelectedTab] = useState(0);
  const [infoCopyText, setInfoCopyText] = useState("Share profile");
  const [inputSearch, setInputSearch] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [inputContactsSearch, setInputContactsSearch] = useState("");
  const openTitleBar = useIsMinimaBrowser();

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
    setSelectedTab(0);
  };

  const SideBarHandler = (key, name) => {
    getPublicKey(key, name);
    setActive(key);
    setMobile(true);
    setIsOpen(false);
  };

  const MobileHandler = () => {
    setMobile(false);
  };

  const onCloseClick = () => {
    setIsOpen(false);
  };

  const onChatContactsClick = () => {
    setIsChatContacts(!isChatContacts);
    setInputContactsSearch("");
    if (!isChatContacts) {
      restartChatContacts();
    }
  };

  const onClickTab = (id) => () => {
    isSelectedTab === id ? setSelectedTab(0) : setSelectedTab(id);
  };

  const welcomeAddContact = (id) => () => {
    setSelectedTab(id);
    if (id === 4) {
      toggleIsOpen();
      setTimeout(() => {
        navigator.clipboard.writeText(responseContact);
        setInfoCopyText("Copied to clipboard");
        setTimeout(() => {
          setInfoCopyText("Share profile");
        }, 3000);
      }, 1000);
    }
  };

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(responseContact);
    setInfoCopyText("Copied to clipboard");
    setTimeout(() => {
      setInfoCopyText("Share profile");
    }, 3000);
  };

  const filtered = contacts.filter((item) =>
    item.extradata.name
      .toLowerCase()
      .includes(inputContactsSearch.toLowerCase())
  );

  return (
    <>
      <div
        className={`maxsolo-sidebar-back ${mobile ? "" : "hide"}`}
        onClick={MobileHandler}
      >
        <BackIcon />
      </div>
      <div className={`maxsolo-sidebar ${mobile ? "mobile" : ""}`}>
        <div className="maxsolo-sidebar-header" onClick={openTitleBar}>
          <div className="header-detail">
            <svg
              onClick={(e) => {
                e.stopPropagation();
                toggleIsOpen();
              }}
              className="header-menu"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <div className="header-title">MaxSolo</div>
            {/* <div onClick={refreshContacts} className={`header-options ${isRefresh ? 'active' : ''} ${mobile ? 'hide' : ''}`}><RefreshIcon /></div> */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChatContactsClick();
              }}
              className={`header-options ${mobile ? "hide" : ""}`}
            >
              New chat <NewChat />
            </div>
          </div>
        </div>

        <EditProfile
          setSelectedTab={setSelectedTab}
          responseName={responseName}
          responseContact={responseContact}
          isSelectedTab={isSelectedTab}
          restartContacts={restartContacts}
        />
        <AddContact
          setSelectedTab={setSelectedTab}
          setIsOpen={setIsOpen}
          isSelectedTab={isSelectedTab}
          restartChatContacts={restartChatContacts}
        />

        <div className={`maxsolo-sidebar-menu ${isOpen ? "open" : ""}`}>
          <div className="close-window" onClick={onCloseClick}>
            <CloseIcon />
          </div>

          <div className="maxsolo-sidebar-menu-name" onClick={onClickTab(1)}>
            <Avatar
              name={responseName}
              size={64}
              round={true}
              maxInitials={2}
            />
            <div className="maxsolo-sidebar-menu-name-details">
              {responseName}
              <br />
              <span>Edit profile</span>
            </div>
          </div>
          <ul>
            <li className="maxsolo-sidebar-menu-item">
              <div
                onClick={onClickTab(2)}
                className={`maxsolo-sidebar-menu-item-tab ${
                  isSelectedTab === 2 ? "active" : ""
                }`}
              >
                <UserIcon /> Add contact
              </div>
            </li>
            <li className="maxsolo-sidebar-menu-item">
              <div
                onClick={copyToClipboard}
                className={`maxsolo-sidebar-menu-item-tab ${
                  infoCopyText === "Copied to clipboard" ? "copied" : ""
                }`}
              >
                {infoCopyText === "Copied to clipboard" ? (
                  <CheckIcon />
                ) : (
                  <ShareIcon />
                )}{" "}
                {infoCopyText}
              </div>
            </li>
            <li className={`maxsolo-sidebar-menu-item`}>
              <SwitcherHeader />
            </li>
            <li className="maxsolo-sidebar-menu-item">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://docs.minima.global/docs/learn/maxima/maximafaq#what-is-maxsolo",
                    "_blank"
                  );
                }}
                className={`maxsolo-sidebar-menu-item-tab`}
              >
                <HelpIcon /> Help
              </div>
            </li>
            <li className="maxsolo-sidebar-menu-item-version">
              {packageJson.version}
            </li>
          </ul>
        </div>

        <div
          onClick={toggleIsOpen}
          className={`maxsolo-sidebar-overlay ${isOpen ? "open" : ""}`}
        ></div>

        {contacts.length > 0 ? (
          <>
            <div className="maxsolo-sidebar-contacts">
              <div className="contact">
                <input
                  placeholder="Search chats"
                  onInput={(e) => setInputSearch(e.target.value)}
                  type="Search"
                />
              </div>
              {lastMessage
                .filter((item) =>
                  item.ROOMNAME.toLowerCase().includes(
                    inputSearch.toLowerCase()
                  )
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className={`contact ${contacts
                      .filter((data) => data.publickey === item.PUBLICKEY)
                      .map((data) =>
                        Boolean(
                          Math.abs(new Date() - data.lastseen) / 60000 < 30
                        )
                      )} ${active === item.PUBLICKEY && "active"}`}
                    onClick={() =>
                      SideBarHandler(item.PUBLICKEY, item.ROOMNAME)
                    }
                  >
                    <Avatar
                      className="contact-profile"
                      name={item.ROOMNAME}
                      size={54}
                      round={true}
                      maxInitials={2}
                    />
                    <div className="contact-detail">
                      <div className="contact-username">{item.ROOMNAME}</div>
                      <span className="contact-date">{getTime(item.DATE)}</span>
                      <div className="break"></div>
                      <div className="contact-content">
                        {item.FILEDATA ? (
                          <div className="contact-message-image">
                            <img src={item.FILEDATA} alt={item.ROOMNAME} />
                          </div>
                        ) : (
                          ""
                        )}
                        <span
                          className={`contact-message ${
                            item.READ === "0" ? "unread" : ""
                          }`}
                        >
                          {item.MESSAGE === "Chat"
                            ? null
                            : decodeURIComponent(item.MESSAGE).replace(
                                "%27",
                                "'"
                              )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <LoaderSidebar welcomeAddContact={welcomeAddContact} />
        )}

        {/* Maxcontacts without chat */}
        <div
          className={`maxsolo-sidebar-overlay ${isChatContacts ? "open" : ""}`}
          onClick={() => {
            setIsChatContacts(false);
            setInputFocus(false);
          }}
        ></div>

        <div
          className={`contact-list-container ${inputFocus ? "full" : ""} ${
            isChatContacts ? "" : "hide"
          }`}
        >
          <div className="contact-list-container-header">
            <div className="title">
              <div>Start a new chat</div>
              <div
                className="close"
                onClick={() => {
                  setIsChatContacts(false);
                  setInputFocus(false);
                }}
              >
                <CloseIcon />
              </div>
            </div>
            <input
              placeholder="Search contacts"
              value={inputContactsSearch}
              onInput={(e) => setInputContactsSearch(e.target.value)}
              type="Search"
              onFocus={() => {
                setInputFocus(true);
              }}
            />
          </div>

          <div className="contact-list-container-content">
            {isChatContacts ? (
              <>
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <div
                      key={index}
                      className={`contact`}
                      onClick={() => {
                        SideBarHandler(item.publickey, item.extradata.name);
                        setIsChatContacts(false);
                        setInputFocus(false);
                      }}
                    >
                      <div className="contact-detail">
                        <div className="contact-username">
                          {item.extradata.name}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="results">No results</div>
                )}
              </>
            ) : null}
          </div>
          <div className="contact-list-container-footer">
            <button
              onClick={() => {
                setIsChatContacts(false);
                setInputFocus(false);
              }}
              className="minima-btn btn-fill-black-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
