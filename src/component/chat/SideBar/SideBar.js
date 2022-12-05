import React, { useState, useRef } from 'react';
import { getTime } from '../../../utils';
import { FaAddressCard, FaShareAlt, FaUserAlt, FaUserSlash } from 'react-icons/fa';
import Avatar from 'react-avatar';
import SwitcherHeader from '../../../elements/switcher/SwitcherHeader';
import LoaderSidebar from '../../../elements/loader/LoaderSidebar';
import NotificationSidebar from '../../../elements/notification/NotificationSidebar';


  const SideBar = ({ getPublicKey, contacts, lastMessage, restartContacts, responseContact, responseName }) => {

  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [contactData, setContactData] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectedTab, setSelectedTab] = useState(0);
  const [buttonCopyText, setButtonCopyText] = useState('Copy');

  const setProfileRef = useRef(null);
  const notifyRef = useRef(null);
  
	const toggleIsOpen = () => {
		setIsOpen(!isOpen);
    setSelectedTab(0);
    setContactData("");
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

  const addContact = (e) => {
    e.preventDefault();

    if(contactData===""){
      notifyRef.current.notifyMessage("Please submit contact.", "error");
      return;
    }

    const addcontact = "maxcontacts action:add contact:"+contactData+"";
    window.MDS.cmd(addcontact, function(resp) {
      if (resp.response.maxima.delivered) {
        notifyRef.current.notifyMessage("Contact created.", "info");
        setContactData("");
        restartContacts();
      }
      else{
        notifyRef.current.notifyMessage("Could not create contact.", "error");
      }
    });
  }

  const setProfile = (e) => {
    e.preventDefault();

    if(setProfileRef.current.value===""){
      notifyRef.current.notifyMessage("Please submit profile name.", "error");
      return;
    }
  
    const setprofile = "maxima action:setname name:"+setProfileRef.current.value+"";
    window.MDS.cmd(setprofile, function(resp) {
      console.log(resp)
      if (resp.status) {
        notifyRef.current.notifyMessage("Profile name updated.", "info");
        setProfileRef.current.value="";
        restartContacts();
      }
      else{
        notifyRef.current.notifyMessage("Could not update name.", "error");
      }
    });
  }

  const deleteContact = (id, currentaddress, publickey) => {
    console.log("Contact deleted" + id + currentaddress);
    const deletecontact = "maxcontacts action:remove contact:"+currentaddress+" id:"+id+"";
    window.MDS.cmd(deletecontact, function(resp) {
      if (resp.status) {
        notifyRef.current.notifyMessage("Contact deleted.", "info");
        window.MDS.sql("DELETE from messages WHERE publickey='"+publickey+"'", function(sqlmsg){      
          if(sqlmsg.status){
            notifyRef.current.notifyMessage("Contact & messages deleted.", "info");
            setSelectedTab(0);
            restartContacts();
          }
        }); 
      }
      else{
        notifyRef.current.notifyMessage("Could not delete contact.", "error");
      }
    });
  }

  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(responseContact);
    setButtonCopyText("Copied!");
    notifyRef.current.notifyMessage("Your Maxima contact copied.", "info");
    setTimeout(() => {
      setButtonCopyText("Copy");
    }, 1000); 
  };
  
  const onClickTab = id => () => {
    isSelectedTab === id ? setSelectedTab(0) : setSelectedTab(id);
  }

  const welcomeAddContact = id => () => {
    setSelectedTab(id);
    setIsOpen(!isOpen);
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
            <div className={`maxsolo-sidebar-menu ${isOpen ? 'open' : ''}`}>
              <NotificationSidebar ref={notifyRef} />
              <div className='maxsolo-sidebar-menu-name'>
                <Avatar name={responseName} size={64} round={true} maxInitials={2}/> 
                <div className='maxsolo-sidebar-menu-name-details'>
                  {responseName}<br/>
                  <span onClick={onClickTab(3)}>Edit profile information</span>
                </div>
              </div>
              <ul>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={onClickTab(1)} className = {`maxsolo-sidebar-menu-item-tab ${isSelectedTab === 1 ? 'active' : ''}`}>
                    <FaAddressCard /> Add contact
                  </div>
                  <div className={`maxsolo-sidebar-menu-item-container ${isSelectedTab === 1 ? 'active' : ''}`} >
                      <div className='maxsolo-sidebar-menu-header'>
                        <span>Enter a Maxima Contact address into the field below to add a new contact to MaxSolo.</span>
                      </div>
                      <form onSubmit={addContact}>
                        <textarea onChange={(e) => {setContactData(e.target.value)} } type="text" placeholder="" value={contactData} />
                        <div className='contact-form-button'>
                            <button className="minima-btn btn-fill-blue-medium">Add contact</button>
                        </div>
                      </form>
                  </div>
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={onClickTab(2)} className = {`maxsolo-sidebar-menu-item-tab ${isSelectedTab === 2 ? 'active' : ''}`}>
                    <FaUserSlash/> Delete Contact
                  </div>
                  <div className={`maxsolo-sidebar-menu-item-container ${isSelectedTab === 2 ? 'activebig' : ''}`} >
                    {contacts.map(((item)=>(
                          <div key={item.id} className='contact-list-item'>
                            <Avatar name={item.extradata.name} size={18} round={true} maxInitials={2}/>
                            <div className='contact-list-item-name'>{item.extradata.name}</div>
                            <div className='contact-list-item-but-del' onClick={() => deleteContact(item.id, item.currentaddress, item.publickey)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                              </svg>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={onClickTab(3)} className = {`maxsolo-sidebar-menu-item-tab ${isSelectedTab === 3 ? 'active' : ''}`}>
                    <FaUserAlt /> Set profile
                  </div>
                  <div className={`maxsolo-sidebar-menu-item-container ${isSelectedTab === 3 ? 'active' : ''}`} >
                      <div className='maxsolo-sidebar-menu-header'>
                        <span>Set your profile name in Contacts</span>
                      </div>
                      <form onSubmit={setProfile}>
                        <textarea type="text" placeholder="" ref={setProfileRef} />
                        <div className='contact-form-button'>
                            <button className="minima-btn btn-fill-blue-medium">Set name</button>
                        </div>
                      </form>
                  </div>
                </li>
                <li className='maxsolo-sidebar-menu-item'>
                  <div onClick={onClickTab(4)} className = {`maxsolo-sidebar-menu-item-tab ${isSelectedTab === 4 ? 'active' : ''}`}>
                    <FaShareAlt /> Share profile
                  </div>
                  <div className={`maxsolo-sidebar-menu-item-container ${isSelectedTab === 4 ? 'active' : ''}`} >
                      <div className='maxsolo-sidebar-menu-header'>
                        <span>{responseName} Maxima address</span>
                      </div>
                      <form>
                        <textarea type="text" readOnly defaultValue={responseContact} />
                        <div className='contact-form-button'>
                            <button onClick={copyToClipboard} className="minima-btn btn-fill-blue-medium">{buttonCopyText}</button>
                        </div>
                      </form>
                  </div>
                </li>
                <li onClick={onClickTab(5)} className = {`maxsolo-sidebar-menu-item-tab my_switcher header-options ${isSelectedTab === 5 ? 'active' : ''}`}>
                  <SwitcherHeader />
                </li>
              </ul>
            </div>

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