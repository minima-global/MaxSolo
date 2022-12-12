import React, { useState } from 'react';
import { getTime } from '../../../utils';
import { FaQuestionCircle } from 'react-icons/fa';
import Avatar from 'react-avatar';
import SwitcherHeader from '../../../elements/switcher/SwitcherHeader';
import LoaderSidebar from '../../../elements/loader/LoaderSidebar';
import EditProfile from '../../../elements/interface/EditProfile';
import AddContact from '../../../elements/interface/AddContact';


  const SideBar = ({ getPublicKey, contacts, lastMessage, restartContacts, responseContact, responseName }) => {

  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectedTab, setSelectedTab] = useState(0);
  const [infoCopyText, setInfoCopyText] = useState('Share profile');
  
	const toggleIsOpen = () => {
		setIsOpen(!isOpen);
    setSelectedTab(0);
	};

  const SideBarHandler = (key, name) => {
    getPublicKey(key, name); 
    setActive(key);
    setMobile(true);
    setIsOpen(false);
  }

  const MobileHandler = () => {
    setMobile(false);
  }
  
  const onClickTab = id => () => {
    isSelectedTab === id ? setSelectedTab(0) : setSelectedTab(id);
  }

  const welcomeAddContact = id => () => {
    setSelectedTab(id);
    // setIsOpen(!isOpen);
  }

  const onCloseClick = () => {
    setIsOpen(false);
  }

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(responseContact);
    setInfoCopyText('Copied to clipboard!');
    setTimeout(() => {
      setInfoCopyText('Share profile');
    }, 3000); 
  };
  
  return (
    <>
          <div className={`maxsolo-sidebar-back ${mobile ? '' : 'hide'}`} onClick={MobileHandler}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
          <div className={`maxsolo-sidebar ${mobile ? 'mobile' : ''}`}>
            <div className="maxsolo-sidebar-header">
              <div className="header-detail">
                <svg onClick={toggleIsOpen} className="header-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                <div className="header-title">MaxSolo</div>
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
                <li className = {`maxsolo-sidebar-menu-item-tab my_switcher header-options`}>
                  <SwitcherHeader />
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={(e) => { e.preventDefault(); window.open("https://docs.minima.global/docs/learn/maxima/maximafaq#what-is-maxsolo", "_blank");}} className = {`maxsolo-sidebar-menu-item-tab`}>
                    <FaQuestionCircle /> Help
                  </div>
                </li>
              </ul>
              <div className='maxsolo-sidebar-menu-buttons'>
                <button onClick={onClickTab(2)} className="minima-btn btn-fill-blue-medium">Add contact</button>  
                <button onClick={copyToClipboard} className={`minima-btn btn-outlined-blue ${infoCopyText === "Copied to clipboard!" ? 'copied' : ''}`}>{infoCopyText}</button>    
              </div>
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