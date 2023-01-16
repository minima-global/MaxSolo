import React, { useState, useRef } from 'react';
import { getTime, tokenName, tokenUrl, linkOutput } from '../../../utils';
import {Decimal} from 'decimal.js';
import Resizer from "react-image-file-resizer";
import Avatar from 'react-avatar';
import ShowSuccess from "../../../elements/send-token/ShowSuccess";
import ShowPending from "../../../elements/send-token/ShowPending";
// import ShowVault from '../../../elements/send-token/ShowVault';
import ScrollBottom from "../../../elements/scroll/ScrollBottom";
import LightBox from '../../../elements/lightbox/Lightbox';
import DropDown from '../../../elements/dropdown/DropDown';
import NotificationSidebar from '../../../elements/notification/NotificationSidebar';
import UserProfile from '../../../elements/modalbox/UserProfile';
import TextareaAutosize from 'react-textarea-autosize';
import { AddImage, TokenIcon, SendIcon, SendActive, PlusIcon } from '../../../elements/icons/MaxSoloIcons';

const ChatArea = ({loadMessages, restartContacts, getBalance, getCurrentAddress, getContactId, getMinimaAddress, publicRoomKey, chatData, sendData, responseName, roomName, lastSeen}) => {

  const [messageData, setMessageData] = useState("");
  const [baseImage, setBaseImage] = useState("");
  const [active, setActive] = useState('');
  const [tokenID, setTokenID] = useState('');
  const [tokenTitle, setTokenTitle] = useState('Minima');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenSendable, setTokenSendable] = useState(0);
  const inputToken = useRef(null);

  const [showToken, setShowToken] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSendTokenBut, setShowSendTokenBut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPending, setShowPending] = useState(false);
  // const [showVault, setShowVault] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [errorText, setErrorText] = useState('');
  // const [inputText, setInputText] = useState('');
  const [newSize, setNewSize] = useState('68px');

  const notifyRef = useRef(null);
  const imageMimeType = /image\/(png|jpg|jpeg|webp)/i;


  const onButtonClick = () => {   
    // console.log("Send token window");
    setShowToken(!showToken);
    setTimeout(function() {
      setShowSuccess(false);
      setShowPending(false);
    }, 1000);

    // A new functionality, to do
    //setShowVault(false);

    setShowMenu(false);
    setShowSendTokenBut(false);
    inputToken.current.value = "";
    document.querySelector('body').classList.toggle("overhidden");
  };

  const onMenuClick = () => {   
    setShowMenu(!showMenu);
    setActive('');
  };

  const onMaxAmountClick = () => {   
    inputToken.current.value = tokenSendable;
    if(inputToken.current.value.length <= 12){
      setNewSize(parseInt(70 - inputToken.current.value.length * 1.98));
      console.log("0 > 12");
    }else if(12 <= inputToken.current.value.length &&  inputToken.current.value.length <= 24){
      setNewSize(parseInt(70 - inputToken.current.value.length * 2.215));      
      console.log("12 < 21");
    }  
    
  };

  // Uploading and resizing image

  const uploadImage = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file.type.match(imageMimeType)) {
        notifyRef.current.notifyMessage("Image mime type is not valid, only images supported.", "error");
        return;
      }
      await resizeFile(file);
    } catch (err) {
      notifyRef.current.notifyMessage(err, "error");
      // console.log(err);
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
    onMenuClick();
    Resizer.imageFileResizer(
      file,
      800,
      800,
      "JPEG",
      70,
      0,
      (uri) => {
        setBaseImage(uri);
      },
      "base64"
    );
  });

  const tokenHandler = (name, id, sendable) => {
    // console.log(name, id)
    setTokenSendable(sendable);
    setActive(name);
    setTokenTitle(name);
    setTokenID(id);
  }


  const onSetErrorClick = (copy) => {
    console.log("Error copy", copy);
    setErrorText(copy); 
    setTimeout(function() { 
      setErrorText(""); 
      setShowSendTokenBut(false);
      return;
    }, 3000);
  }

  const submitToken = (e) => {
    // console.log("Submit token", tokenSendable)
    e.preventDefault();

    Decimal.set({ precision: 60 });

    const tokenid = tokenID;
    const tokenamount = inputToken.current.value;
    const tokenname = tokenTitle;

    if( tokenamount == "" || tokenamount <= 0 ){
      return onSetErrorClick("Invalid amount..."); 
    }

    if(tokenid == ""){
      return onSetErrorClick("Please select token...");
    }

    const roundedAmount = new Decimal(tokenamount).toDecimalPlaces(18).toString();
    const tokenamountsend = new Decimal(inputToken.current.value);
    const tokenamountsendable = new Decimal(tokenSendable);

    setTokenAmount(tokenamount);
    setShowMenu(false);
    setShowSendTokenBut(true);

    if(tokenamountsend.greaterThan(tokenamountsendable))return onSetErrorClick ("Insufficient funds..."); 

    window.MDS.cmd("maxcontacts action:search publickey:"+publicRoomKey,function(resp){
		    
      //Get the contact      
      const sendfunction = "send tokenid:"+tokenid+" amount:"+tokenamountsend+" address:"+getMinimaAddress;
      
      window.MDS.cmd(sendfunction, function(resp){
        
        console.log("Token", resp);
        
        const tokenSendData = (message) =>{
            var data = {};
            data.message  	= ""+message+" "+roundedAmount+" "+tokenname+"";
            data.username 	= responseName;
            data.type 		  = "text";
            data.filedata  	= "";
            //Send this..
            sendData(data);
        }
  
        //Did it work..
        if(resp.status == false){
          //Is it pending...
          if(resp.pending){
            tokenSendData('Transaction pending of');
            setTimeout(function() {
              setShowPending(true);
              setShowSendTokenBut(false);
            }, 1000);
          }else{
            window.MDS.log(JSON.stringify(resp));
            alert("ERROR : "+resp.message);
            return;	
          }	
        }
        if(resp.status == true){
          tokenSendData('I just sent you');
          setTimeout(function() {
            setShowSuccess(true);
            setShowSendTokenBut(false);
          }, 1000);
        }
      });
    });
  }

  const submitHandle = (e) => {
    // console.log("Image: " + baseImage)
    e.preventDefault();
    var data = {};
    data.username = responseName;
    if(!messageData == "" && !baseImage){
      data.type = "text";
      data.message = messageData;
      data.filedata = "";
      sendData(data);
      setMessageData("");
    }
    if(!baseImage == ""){
      data.type = "image";
      data.filedata = baseImage;
      data.message = "";
      if(!messageData == ""){
        data.message = messageData;
      }
      sendData(data);
      setMessageData("");
      setBaseImage("");
    }
  }
  
  const deleteMessages = () =>{  
    console.log("Messages Deleted");
    window.MDS.sql("DELETE from messages WHERE publickey='"+publicRoomKey+"'", function(sqlmsg){      
      if(sqlmsg.status){
        loadMessages();
        restartContacts();
        notifyRef.current.notifyMessage("Messages in chat deleted.", "info");
      }
    }); 
  }

  const deleteContact = () => {
    console.log("Contact deleted" + getContactId + getCurrentAddress);
    const deletecontact = "maxcontacts action:remove contact:"+getCurrentAddress+" id:"+getContactId+"";
    window.MDS.cmd(deletecontact, function(resp) {
      if (resp.status) {
        deleteMessages();
        setTimeout(() => {
          notifyRef.current.notifyMessage("Contact removed.", "info");
        }, 1000); 
      }
      else{
        notifyRef.current.notifyMessage("Could not remove contact.", "error");
      }
    });
  }

  const getMaximaContact = ( ) => {
    window.MDS.cmd("maxcontacts action:search publickey:"+publicRoomKey,function(resp){
      navigator.clipboard.writeText(resp.response.contact.currentaddress);
      notifyRef.current.notifyMessage("Contact copied.", "info");
    });
  }

  const handleUserProfileClick = event => {
    setShowUserProfile(!showUserProfile)
  };

  return (
    <>  
          <UserProfile deleteContact={deleteContact} roomName={roomName} lastSeen={lastSeen} deleteMessages={deleteMessages} publicRoomKey={publicRoomKey} showUserProfile={showUserProfile} setShowUserProfile={setShowUserProfile} />
          
          <div className="maxsolo-chat-area">
            <div className="maxsolo-chat-area-header">
              <div className="maxsolo-chat-area-title" onClick={handleUserProfileClick}>
                <Avatar className="maxsolo-chat-area-title-profile" name={roomName} size={54} round={true} maxInitials={2}/>
                <div className="maxsolo-chat-area-title-room">
                  {roomName} 
                  <span className="maxsolo-chat-area-title-room-lastseen">Last seen {lastSeen}</span>
                </div>
              </div> 
              <div className="maxsolo-chat-area-group">
                <DropDown deleteMessages={deleteMessages} getMaximaContact={getMaximaContact} roomName={roomName} />
              </div>
            </div>

            <div className={`send-tokens-window ${showToken ? "" : "hide"} ${active ? "height" : ""}`}>
                <div className='close-window' onClick={onButtonClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <div className='send-tokens-window-header'>{active ? 'Amount to send' : 'Select token'}</div>
                <div className={`send-tokens-window-number ${active ? "" : "hide"}`}>
                    <input style={{fontSize: newSize+'px'}} className={`${errorText ? 'error' : ''}`} ref={inputToken} onChange={(event) => { 
                        try {
                          const tokenamountsend = new Decimal(event.target.value); 
                          const tokenamountsendable = new Decimal(tokenSendable); 
                          if(event.target.value.length <= 12){
                            setNewSize(parseInt(70 - event.target.value.length * 1.98));
                          }else if(12 <= event.target.value.length &&  event.target.value.length <= 24){
                            setNewSize(parseInt(70 - event.target.value.length * 2.215));      
                          }                     
                          if(tokenamountsend.greaterThan(tokenamountsendable))onSetErrorClick("Insufficient funds...")
                        }
                        catch(err) {
                          console.log(err);
                        }                    
                      }} placeholder="0" type="number" pattern="\d*" min="0" />
                  <div className='info-input'>{errorText}</div>
                </div>
                <div onClick={onMaxAmountClick} className={`send-tokens-window-max ${active ? "" : "hide"}`}>MAX</div>
                <div className='send-tokens-window-balance'>
                  {getBalance.map(((item, index)=>(
                    <div className={`send-tokens-window-balance-item ${active ? active === tokenName(item.token.name) && 'active' : ''}`} key={index} onClick={() => tokenHandler(tokenName(item.token.name), item.tokenid, item.sendable)}>
                      <div className='token-logotype'><img src={tokenUrl(item.token.url)} alt="" /></div>
                      <div className='token-details'>
                        <div className='token-name'>{tokenName(item.token.name)}</div>
                        <div className='token-balance'>{item.token.ticker}</div>
                        <div className='token-balance'>{item.sendable}</div>
                      </div>
                    </div>
                  )))}
                </div>
                <button onClick={submitToken} disabled={showSendTokenBut} className={`minima-btn btn-fill-blue-medium ${active ? "" : "hide"}`}>Send</button>
                <button onClick={onButtonClick} className="minima-btn btn-fill-black-medium">Cancel</button>

                <ShowPending showPending={showPending} tokenAmount={tokenAmount} tokenTitle={tokenTitle} onButtonClick={onButtonClick} />
                <ShowSuccess showSuccess={showSuccess} tokenAmount={tokenAmount} tokenTitle={tokenTitle} onButtonClick={onButtonClick} />
            </div>
           
            <div onClick={onMenuClick} className={`chat-area-footer-overlay ${showMenu || showToken ? "show" : ""}`}></div>
           
            <div className="maxsolo-chat-area-main">

                <div className='maxsolo-chat-area-main-notification'>
                  <div>
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                    <path  d="M8.42,6.99v2.15h7.16V6.99c0-1.98-1.6-3.58-3.58-3.58S8.42,5.01,8.42,6.99z M5.56,9.14V6.99 c0-3.56,2.89-6.44,6.44-6.44s6.44,2.89,6.44,6.44v2.15h0.72c1.58,0,2.86,1.28,2.86,2.86v8.59c0,1.58-1.28,2.86-2.86,2.86H4.84 c-1.58,0-2.86-1.28-2.86-2.86V12c0-1.58,1.28-2.86,2.86-2.86H5.56z"/>
                    </svg>
                  </div>
                  <span>Messages to this chat with {roomName} are now secured with end-to-end encryption.</span>
                </div>
                <NotificationSidebar ref={notifyRef} />
                {chatData.map(((item, index)=>(
                    <div key={index}>
                      {item.MESSAGE === "Chat" ? null : 
                      <div className={`chat-msg ${item.ROOMNAME === item.USERNAME ? "" : "owner"}`}>
                      <div className="chat-msg-profile">
                        <div className="chat-msg-date">
                          {getTime(item.DATE)}
                        </div>
                      </div>
                      <div className="chat-msg-content">
                        <div className="chat-msg-text">
                          {item.FILEDATA ? 
                          <LightBox src={item.FILEDATA} alt="MaxSolo">
                            <img src={item.FILEDATA} className="img-prev" alt="" />
                          </LightBox> : "" }
                          {item.MESSAGE ?
                          <span>{item.MESSAGE === "Chat" ? null: linkOutput(decodeURIComponent(item.MESSAGE).replace("%27", "'")) }</span> : "" }
                        </div>
                      </div>
                      </div>
                      }
                    </div>
                  ))
                  )}

                <div className={`chat-area-footer-menu ${showMenu && !showToken ? "show" : ""}`}>
                    <div className='chat-area-footer-menu-item' onClick={onButtonClick}>
                      <TokenIcon />
                      Send tokens
                    </div>
                    <div className='chat-area-footer-menu-item'>
                      <label htmlFor="file-input">
                        <AddImage />
                        Send image
                      </label>
                    </div>
                    <div className='chat-area-footer-menu-button'>
                      <button onClick={onMenuClick} className="minima-btn btn-fill-black-medium">Cancel</button>
                    </div>
                </div>

                <div className='chat-area-footer'>   
                  <form data-testid='form-submit' onSubmit={submitHandle}>
                    {baseImage ? <div className='image-preview'><img src={baseImage} height='32px' width='32px' alt='' /></div> : '' }
                    <div onClick={onMenuClick}><PlusIcon /></div>
                    <input id='file-input' type='file' accept='image/*'
                      onChange={(e) => {
                        uploadImage(e);
                      }}
                      style={{display: 'none'}}
                      onClick={e => (e.target.value = null)}
                    />
                    {roomName ? <TextareaAutosize maxRows={messageData ? '5' : '1'} autoFocus data-testid='input-text' onChange={(e) => {setMessageData(e.target.value);} } placeholder='Write a message' value={messageData} /> : null}
                    {messageData.trim() || baseImage ? (
                      <div onClick={submitHandle}><SendActive /></div>
                    ) : (
                      <SendIcon />
                    )}
                  </form>
                </div>

            </div>

          <ScrollBottom/>
        </div>
    </>
  ) 

}

export default ChatArea;