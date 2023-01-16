import React, { useState, useEffect } from 'react';
import { getTime } from '../../../utils';
import Avatar from 'react-avatar';
import SwitcherHeader from '../../../elements/switcher/SwitcherHeader';
import LoaderSidebar from '../../../elements/loader/LoaderSidebar';
import EditProfile from '../../../elements/interface/EditProfile';
import AddContact from '../../../elements/interface/AddContact';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserIcon, ShareIcon, HelpIcon, CheckIcon, BackIcon, RefreshIcon } from '../../../elements/icons/MaxSoloIcons';


  const SideBar = ({ getPublicKey, contacts, lastMessage, restartContacts, responseContact, responseName }) => {

  // const contacts = [];

  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isSelectedTab, setSelectedTab] = useState(0);
  const [infoCopyText, setInfoCopyText] = useState('Share profile');

  // const storeMobile = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("mobile", JSON.stringify(value));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const getMobile = async () => {
  //       try {
  //           const mobileData = JSON.parse(await AsyncStorage.getItem("mobile"))
  //           setMobile(mobileData);
  //       } catch (error) {
  //           console.log(error); 
  //       }
  //   };
    
  //   getMobile();

  // }, []);


  
	const toggleIsOpen = () => {
		setIsOpen(!isOpen);
    setSelectedTab(0);
	};

  const SideBarHandler = (key, name) => {
    // document.querySelector('.maxsolo-chat-area').classList.add("mobile");
    getPublicKey(key, name); 
    setActive(key);
    setMobile(true);
    // storeMobile(true); 
    setIsOpen(false);
  }

  const MobileHandler = () => {
    setMobile(false);
    // document.querySelector('.maxsolo-chat-area').classList.remove("mobile");
    // storeMobile(false); 
  }

  const onCloseClick = () => {
    setIsOpen(false);
  }
  
  const onClickTab = id => () => {
    isSelectedTab === id ? setSelectedTab(0) : setSelectedTab(id);
  }

  const welcomeAddContact = id => () => {
    setSelectedTab(id);
    if(id === 4){
      toggleIsOpen();
      setTimeout(() => {
        navigator.clipboard.writeText(responseContact);
        setInfoCopyText('Copied to clipboard');
        setTimeout(() => {
          setInfoCopyText('Share profile');
        }, 3000); 
      }, 1000); 

    }
  }

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(responseContact);
    setInfoCopyText('Copied to clipboard');
    setTimeout(() => {
      setInfoCopyText('Share profile');
    }, 3000); 
  };

  const refreshContacts = () => {
    console.log("Refresh")
    restartContacts();
    setIsRefresh(true);
    setTimeout(() => {
      setIsRefresh(false);
    }, 3000); 
  }

  return (
    <>
          <div className={`maxsolo-sidebar-back ${mobile ? '' : 'hide'}`} onClick={MobileHandler}><BackIcon /></div>
          <div className={`maxsolo-sidebar ${mobile ? 'mobile' : ''}`}>
            <div className="maxsolo-sidebar-header">
              <div className="header-detail">
                <svg onClick={toggleIsOpen} className="header-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                <div className='header-title'>MaxSolo</div>
                <div onClick={refreshContacts} className={`header-options ${isRefresh ? 'active' : ''} ${mobile ? '' : 'hide'}`}><RefreshIcon /></div>
              </div>
            </div>

            <EditProfile setSelectedTab={setSelectedTab} responseName={responseName} responseContact={responseContact} isSelectedTab={isSelectedTab} restartContacts={restartContacts}/>
            <AddContact setSelectedTab={setSelectedTab} setIsOpen={setIsOpen} isSelectedTab={isSelectedTab} restartContacts={restartContacts}/>
            
            <div className={`maxsolo-sidebar-menu ${isOpen ? 'open' : ''}`}>

              <div className='close-window' onClick={onCloseClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>

              <div className='maxsolo-sidebar-menu-name' onClick={onClickTab(1)}>
                <Avatar name={responseName} size={64} round={true} maxInitials={2}/> 
                <div className='maxsolo-sidebar-menu-name-details'>
                  {responseName}<br/>
                  <span>Edit profile</span>
                </div>
              </div>
              <ul>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={onClickTab(2)} className = {`maxsolo-sidebar-menu-item-tab ${isSelectedTab === 2 ? 'active' : ''}`}>
                    <UserIcon /> Add contact
                  </div>
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={copyToClipboard} className = {`maxsolo-sidebar-menu-item-tab ${infoCopyText === "Copied to clipboard" ? 'copied' : ''}`}>
                    {infoCopyText === "Copied to clipboard" ? <CheckIcon /> : <ShareIcon />} {infoCopyText}
                  </div>
                </li>
                <li className = {`maxsolo-sidebar-menu-item`}>
                  <SwitcherHeader />
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={(e) => { e.preventDefault(); window.open("https://docs.minima.global/docs/learn/maxima/maximafaq#what-is-maxsolo", "_blank");}} className = {`maxsolo-sidebar-menu-item-tab`}>
                    <HelpIcon /> Help
                  </div>
                </li>
              </ul>
            </div>

            <div onClick={toggleIsOpen} className={`maxsolo-sidebar-overlay ${isOpen ? 'open' : ''}`}></div>

            {contacts.length > 0
            ? (<>
                <div className='maxsolo-sidebar-contacts'>
                {lastMessage.map(((item, index)=>(
                  <div className={`contact ${contacts.filter(data => data.publickey === item.PUBLICKEY).map(data => (Boolean((Math.abs(new Date() - data.lastseen))/60000 < 30)))} ${active === item.PUBLICKEY && 'active'}`} key={index} onClick={() => SideBarHandler(item.PUBLICKEY, item.ROOMNAME)}>
                    <Avatar className="contact-profile" name={item.ROOMNAME} size={54} round={true} maxInitials={2}/>
                    <div className="contact-detail">
                      <div className="contact-username">{item.ROOMNAME}</div><span className="contact-date">{contacts.filter(data => data.publickey === item.PUBLICKEY).map(filteredData => (getTime(filteredData.lastseen)))}</span>
                        <div className="break"></div>
                        <div className="contact-content">
                          {item.FILEDATA ? <div className="contact-message-image"><img src={item.FILEDATA}  alt={item.ROOMNAME} /></div> : "" }
                          <span className={`contact-message ${item.READ === "0" ? 'unread' : ''}`}>
                            {item.MESSAGE === "Chat" ? null : decodeURIComponent(item.MESSAGE).replace("%27", "'")}
                          </span>
                        </div>
                    </div>
                  </div>
                ))
                )}
                </div>
            </>)
            : (<LoaderSidebar welcomeAddContact={welcomeAddContact}/>)
            }        
          </div>
    </>
  ) 

}

export default SideBar;