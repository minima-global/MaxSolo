import React, { useState } from 'react';
import { BackIcon } from '../icons/MaxSoloIcons';

const AddContact = ({ isSelectedTab, setIsOpen, setSelectedTab }) => {

    const [infoNotifyText, setInfoNotifyText] = useState('');
    const [contactData, setContactData] = useState('');
    const [addButton, setAddButton] = useState(true);

    const addContact = (e) => {
      e.preventDefault();

      setAddButton(true);
  
      if(contactData == ""){
        setSelectedTab(0);
        return;
      }else{
        const addcontact = "maxcontacts action:add contact:"+contactData+"";
        window.MDS.cmd(addcontact, function(resp) {
          if(resp.status) {
            console.log(resp);
            setContactData('');
            setSelectedTab(0);
            setIsOpen(false);
          }else{
            setInfoNotifyText('This address is not valid. Please ask your contact to send it again and enter it within a 10 minute window.');
            setTimeout(() => {
              setInfoNotifyText('');
            }, 3000); 
          }
        });
      }
    }

    const onCancelClick = () => {   
      setSelectedTab(0);
      setContactData('');
    };

    return (
        <div className={`maxsolo-sidebar-container ${isSelectedTab === 2 ? 'active' : ''}`} >
            <div className='maxsolo-sidebar-container-button' onClick={addContact}>
              <BackIcon /> Add contact
            </div>
            <div className='maxsolo-sidebar-container-content'>
              <div className='main-title'>Enter your contact’s Minima address</div>
              <form onSubmit={addContact}>
                <textarea onChange={(e) => {setContactData(e.target.value); setAddButton(false)} } type="text" placeholder="MxG18HGG6FJ038614Y8CW46US6G20810K0070CD00Z83282G60G1D1D2TCT25T7TFBCMG99T60D810YM4E7BUQ71UASBF3998ZYH0DVTNDVPDU7H15N68NQUZS47NT3B1JMUQ5C7A9UBHSV2R67BRJT2CEDKEPBKJK2B55DYRYD0BDW44H2B302N4GP2GW5REW872RQBRPMYJC5D4KUSUSC21T5A6RPQTEQGFEBYKAYPS99ZGFP1ZRA887J0WS1RC10608004R17YJQ@185.209.230.202:9001" value={contactData} className={`${infoNotifyText ? 'error' : ''}`}/>
                <div className='info-input'>{infoNotifyText}</div>
                <div className='contact-form-button'>
                  <button onClick={addContact} disabled={addButton} className="minima-btn btn-fill-blue-medium">Add contact</button>
                  <button onClick={onCancelClick} className="minima-btn btn-fill-black-medium">Cancel</button>
                </div>
              </form>
            </div>
        </div>
    )
}

export default AddContact;