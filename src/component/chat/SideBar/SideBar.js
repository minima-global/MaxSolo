import React, { useState } from 'react';
import { getTime } from '../../../utils';
import { FaQuestionCircle, FaShareAlt, FaAddressCard } from 'react-icons/fa';
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
    setInfoCopyText('Copied to clipboard');
    setTimeout(() => {
      setInfoCopyText('Share profile');
    }, 3000); 
  };

  const UserIcon = () =>{
    return(
      <>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 9.99656C17.7833 9.99656 17.6042 9.92572 17.4625 9.78406C17.3208 9.64239 17.25 9.46322 17.25 9.24656V6.74656H14.75C14.5333 6.74656 14.3542 6.67572 14.2125 6.53406C14.0708 6.39239 14 6.21322 14 5.99656C14 5.77989 14.0708 5.60072 14.2125 5.45906C14.3542 5.31739 14.5333 5.24656 14.75 5.24656H17.25V2.74656C17.25 2.52989 17.3208 2.35072 17.4625 2.20906C17.6042 2.06739 17.7833 1.99656 18 1.99656C18.2167 1.99656 18.3958 2.06739 18.5375 2.20906C18.6792 2.35072 18.75 2.52989 18.75 2.74656V5.24656H21.25C21.4667 5.24656 21.6458 5.31739 21.7875 5.45906C21.9292 5.60072 22 5.77989 22 5.99656C22 6.21322 21.9292 6.39239 21.7875 6.53406C21.6458 6.67572 21.4667 6.74656 21.25 6.74656H18.75V9.24656C18.75 9.46322 18.6792 9.64239 18.5375 9.78406C18.3958 9.92572 18.2167 9.99656 18 9.99656ZM8 7.97156C6.9 7.97156 6 7.62156 5.3 6.92156C4.6 6.22156 4.25 5.32156 4.25 4.22156C4.25 3.12156 4.6 2.22156 5.3 1.52156C6 0.821558 6.9 0.471558 8 0.471558C9.1 0.471558 10 0.821558 10.7 1.52156C11.4 2.22156 11.75 3.12156 11.75 4.22156C11.75 5.32156 11.4 6.22156 10.7 6.92156C10 7.62156 9.1 7.97156 8 7.97156ZM0.75 15.9966C0.533333 15.9966 0.354167 15.9257 0.2125 15.7841C0.0708333 15.6424 0 15.4632 0 15.2466V13.6466C0 13.0632 0.15 12.5341 0.45 12.0591C0.75 11.5841 1.16667 11.2299 1.7 10.9966C2.95 10.4466 4.0625 10.0591 5.0375 9.83406C6.0125 9.60906 7 9.49656 8 9.49656C9 9.49656 9.9875 9.60906 10.9625 9.83406C11.9375 10.0591 13.0417 10.4466 14.275 10.9966C14.8083 11.2466 15.2292 11.6049 15.5375 12.0716C15.8458 12.5382 16 13.0632 16 13.6466V15.2466C16 15.4632 15.9292 15.6424 15.7875 15.7841C15.6458 15.9257 15.4667 15.9966 15.25 15.9966H0.75ZM1.5 14.4966H14.5V13.6466C14.5 13.3799 14.4333 13.1257 14.3 12.8841C14.1667 12.6424 13.9583 12.4632 13.675 12.3466C12.5083 11.7799 11.5125 11.4132 10.6875 11.2466C9.8625 11.0799 8.96667 10.9966 8 10.9966C7.03333 10.9966 6.1375 11.0841 5.3125 11.2591C4.4875 11.4341 3.48333 11.7966 2.3 12.3466C2.05 12.4632 1.85417 12.6424 1.7125 12.8841C1.57083 13.1257 1.5 13.3799 1.5 13.6466V14.4966ZM8 6.47156C8.65 6.47156 9.1875 6.25906 9.6125 5.83406C10.0375 5.40906 10.25 4.87156 10.25 4.22156C10.25 3.57156 10.0375 3.03406 9.6125 2.60906C9.1875 2.18406 8.65 1.97156 8 1.97156C7.35 1.97156 6.8125 2.18406 6.3875 2.60906C5.9625 3.03406 5.75 3.57156 5.75 4.22156C5.75 4.87156 5.9625 5.40906 6.3875 5.83406C6.8125 6.25906 7.35 6.47156 8 6.47156Z" />
        </svg>
      </>
    )
  }

  const ShareIcon = () =>{
    return(
      <>
        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.175 20.9966C14.3917 20.9966 13.7208 20.7174 13.1625 20.1591C12.6042 19.6007 12.325 18.9299 12.325 18.1466C12.325 18.0299 12.3375 17.8924 12.3625 17.7341C12.3875 17.5757 12.425 17.4299 12.475 17.2966L4.9 12.8966C4.65 13.1799 4.34167 13.4091 3.975 13.5841C3.60833 13.7591 3.23333 13.8466 2.85 13.8466C2.06667 13.8466 1.39583 13.5674 0.8375 13.0091C0.279167 12.4507 0 11.7799 0 10.9966C0 10.1966 0.279167 9.52158 0.8375 8.97158C1.39583 8.42158 2.06667 8.14658 2.85 8.14658C3.23333 8.14658 3.6 8.22158 3.95 8.37158C4.3 8.52158 4.61667 8.73825 4.9 9.02158L12.475 4.67158C12.425 4.55492 12.3875 4.42158 12.3625 4.27158C12.3375 4.12158 12.325 3.97992 12.325 3.84658C12.325 3.04658 12.6042 2.37158 13.1625 1.82158C13.7208 1.27158 14.3917 0.996582 15.175 0.996582C15.975 0.996582 16.65 1.27158 17.2 1.82158C17.75 2.37158 18.025 3.04658 18.025 3.84658C18.025 4.62992 17.75 5.30075 17.2 5.85908C16.65 6.41742 15.975 6.69658 15.175 6.69658C14.7917 6.69658 14.4208 6.63408 14.0625 6.50908C13.7042 6.38408 13.4 6.17992 13.15 5.89658L5.575 10.0966C5.60833 10.2299 5.6375 10.3841 5.6625 10.5591C5.6875 10.7341 5.7 10.8799 5.7 10.9966C5.7 11.1132 5.6875 11.2382 5.6625 11.3716C5.6375 11.5049 5.60833 11.6382 5.575 11.7716L13.15 16.0716C13.4 15.8382 13.6917 15.6507 14.025 15.5091C14.3583 15.3674 14.7417 15.2966 15.175 15.2966C15.975 15.2966 16.65 15.5716 17.2 16.1216C17.75 16.6716 18.025 17.3466 18.025 18.1466C18.025 18.9299 17.75 19.6007 17.2 20.1591C16.65 20.7174 15.975 20.9966 15.175 20.9966ZM15.175 5.19658C15.5583 5.19658 15.8792 5.06742 16.1375 4.80908C16.3958 4.55075 16.525 4.22992 16.525 3.84658C16.525 3.46325 16.3958 3.14242 16.1375 2.88408C15.8792 2.62575 15.5583 2.49658 15.175 2.49658C14.7917 2.49658 14.4708 2.62575 14.2125 2.88408C13.9542 3.14242 13.825 3.46325 13.825 3.84658C13.825 4.22992 13.9542 4.55075 14.2125 4.80908C14.4708 5.06742 14.7917 5.19658 15.175 5.19658ZM2.85 12.3466C3.23333 12.3466 3.55417 12.2174 3.8125 11.9591C4.07083 11.7007 4.2 11.3799 4.2 10.9966C4.2 10.6132 4.07083 10.2924 3.8125 10.0341C3.55417 9.77575 3.23333 9.64658 2.85 9.64658C2.46667 9.64658 2.14583 9.77575 1.8875 10.0341C1.62917 10.2924 1.5 10.6132 1.5 10.9966C1.5 11.3799 1.62917 11.7007 1.8875 11.9591C2.14583 12.2174 2.46667 12.3466 2.85 12.3466ZM15.175 19.4966C15.5583 19.4966 15.8792 19.3674 16.1375 19.1091C16.3958 18.8507 16.525 18.5299 16.525 18.1466C16.525 17.7632 16.3958 17.4424 16.1375 17.1841C15.8792 16.9257 15.5583 16.7966 15.175 16.7966C14.7917 16.7966 14.4708 16.9257 14.2125 17.1841C13.9542 17.4424 13.825 17.7632 13.825 18.1466C13.825 18.5299 13.9542 18.8507 14.2125 19.1091C14.4708 19.3674 14.7917 19.4966 15.175 19.4966Z" />
        </svg>
      </>
    )
  }

  const HelpIcon = () =>{
    return(
      <>
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.35 16.8216C10.6167 16.8216 10.8417 16.7299 11.025 16.5466C11.2083 16.3632 11.3 16.1382 11.3 15.8716C11.3 15.6049 11.2083 15.3799 11.025 15.1966C10.8417 15.0132 10.6167 14.9216 10.35 14.9216C10.0833 14.9216 9.85833 15.0132 9.675 15.1966C9.49167 15.3799 9.4 15.6049 9.4 15.8716C9.4 16.1382 9.49167 16.3632 9.675 16.5466C9.85833 16.7299 10.0833 16.8216 10.35 16.8216ZM10.325 6.49658C10.8917 6.49658 11.35 6.65075 11.7 6.95908C12.05 7.26742 12.225 7.66325 12.225 8.14658C12.225 8.47991 12.125 8.80908 11.925 9.13408C11.725 9.45908 11.4 9.81325 10.95 10.1966C10.5167 10.5799 10.1708 10.9841 9.9125 11.4091C9.65417 11.8341 9.525 12.2216 9.525 12.5716C9.525 12.7549 9.59583 12.9007 9.7375 13.0091C9.87917 13.1174 10.0417 13.1716 10.225 13.1716C10.425 13.1716 10.5917 13.1049 10.725 12.9716C10.8583 12.8382 10.9417 12.6716 10.975 12.4716C11.025 12.1382 11.1375 11.8424 11.3125 11.5841C11.4875 11.3257 11.7583 11.0466 12.125 10.7466C12.625 10.3299 12.9875 9.91325 13.2125 9.49658C13.4375 9.07992 13.55 8.61325 13.55 8.09658C13.55 7.21325 13.2625 6.50492 12.6875 5.97158C12.1125 5.43825 11.35 5.17158 10.4 5.17158C9.76667 5.17158 9.18333 5.29658 8.65 5.54658C8.11667 5.79658 7.675 6.16325 7.325 6.64658C7.19167 6.82992 7.1375 7.01741 7.1625 7.20908C7.1875 7.40075 7.26667 7.54658 7.4 7.64658C7.58333 7.77991 7.77917 7.82158 7.9875 7.77158C8.19583 7.72158 8.36667 7.60492 8.5 7.42158C8.71667 7.12158 8.97917 6.89242 9.2875 6.73408C9.59583 6.57575 9.94167 6.49658 10.325 6.49658ZM10.25 20.9966C8.85 20.9966 7.54167 20.7424 6.325 20.2341C5.10833 19.7257 4.05 19.0216 3.15 18.1216C2.25 17.2216 1.54167 16.1632 1.025 14.9466C0.508333 13.7299 0.25 12.4132 0.25 10.9966C0.25 9.59658 0.508333 8.28825 1.025 7.07158C1.54167 5.85492 2.25 4.79658 3.15 3.89658C4.05 2.99658 5.10833 2.28825 6.325 1.77158C7.54167 1.25492 8.85 0.996582 10.25 0.996582C11.6333 0.996582 12.9333 1.25492 14.15 1.77158C15.3667 2.28825 16.425 2.99658 17.325 3.89658C18.225 4.79658 18.9375 5.85492 19.4625 7.07158C19.9875 8.28825 20.25 9.59658 20.25 10.9966C20.25 12.4132 19.9875 13.7299 19.4625 14.9466C18.9375 16.1632 18.225 17.2216 17.325 18.1216C16.425 19.0216 15.3667 19.7257 14.15 20.2341C12.9333 20.7424 11.6333 20.9966 10.25 20.9966ZM10.25 19.4966C12.6 19.4966 14.6042 18.6632 16.2625 16.9966C17.9208 15.3299 18.75 13.3299 18.75 10.9966C18.75 8.66325 17.9208 6.66325 16.2625 4.99658C14.6042 3.32992 12.6 2.49658 10.25 2.49658C7.86667 2.49658 5.85417 3.32992 4.2125 4.99658C2.57083 6.66325 1.75 8.66325 1.75 10.9966C1.75 13.3299 2.57083 15.3299 4.2125 16.9966C5.85417 18.6632 7.86667 19.4966 10.25 19.4966Z" />
        </svg>
      </>
    )
  }

  const CheckIcon = () =>{
    return(
      <>
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.41562 14.55L16.4906 7.475L15.3406 6.35L9.41562 12.275L6.41563 9.275L5.29063 10.4L9.41562 14.55ZM10.8906 20C9.52396 20 8.23229 19.7375 7.01562 19.2125C5.79896 18.6875 4.73646 17.9708 3.82812 17.0625C2.91979 16.1542 2.20312 15.0917 1.67812 13.875C1.15312 12.6583 0.890625 11.3667 0.890625 10C0.890625 8.61667 1.15312 7.31667 1.67812 6.1C2.20312 4.88333 2.91979 3.825 3.82812 2.925C4.73646 2.025 5.79896 1.3125 7.01562 0.7875C8.23229 0.2625 9.52396 0 10.8906 0C12.274 0 13.574 0.2625 14.7906 0.7875C16.0073 1.3125 17.0656 2.025 17.9656 2.925C18.8656 3.825 19.5781 4.88333 20.1031 6.1C20.6281 7.31667 20.8906 8.61667 20.8906 10C20.8906 11.3667 20.6281 12.6583 20.1031 13.875C19.5781 15.0917 18.8656 16.1542 17.9656 17.0625C17.0656 17.9708 16.0073 18.6875 14.7906 19.2125C13.574 19.7375 12.274 20 10.8906 20ZM10.8906 18.5C13.2573 18.5 15.2656 17.6708 16.9156 16.0125C18.5656 14.3542 19.3906 12.35 19.3906 10C19.3906 7.63333 18.5656 5.625 16.9156 3.975C15.2656 2.325 13.2573 1.5 10.8906 1.5C8.54063 1.5 6.53646 2.325 4.87813 3.975C3.21979 5.625 2.39062 7.63333 2.39062 10C2.39062 12.35 3.21979 14.3542 4.87813 16.0125C6.53646 17.6708 8.54063 18.5 10.8906 18.5Z" />
        </svg>
      </>
    )
  }
  
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
              {/* <div className='maxsolo-sidebar-menu-buttons'>
                <button onClick={onClickTab(2)} className="minima-btn btn-fill-blue-medium">Add contact</button>  
                <button onClick={copyToClipboard} className={`minima-btn btn-outlined-blue ${infoCopyText === "Copied to clipboard!" ? 'copied' : ''}`}>{infoCopyText}</button>    
              </div> */}
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