import React, { useState, useRef } from 'react';
import { getTime, tokenName, tokenUrl, linkOutput } from '../../../utils';
import {Decimal} from 'decimal.js';
import Resizer from "react-image-file-resizer";
import Avatar from 'react-avatar';
import ShowSuccess from "../../../elements/send-token/ShowSuccess";
import ShowPending from "../../../elements/send-token/ShowPending";
import ScrollBottom from "../../../elements/scroll/ScrollBottom";
import LightBox from '../../../elements/lightbox/Lightbox';
import DropDown from '../../../elements/dropdown/DropDown';
import NotificationSidebar from '../../../elements/notification/NotificationSidebar';
import UserProfile from '../../../elements/modalbox/UserProfile';


const ChatArea = ({loadMessages, restartContacts, getBalance, getCurrentAddress, getContactId, getMinimaAddress, publicRoomKey, chatData, sendData, responseName, roomName, lastSeen}) => {

  const [messageData, setMessageData] = useState("");
  const [baseImage, setBaseImage] = useState("");
  const [active, setActive] = useState('Minima');
  const [tokenID, setTokenID] = useState('0x00');
  const [tokenTitle, setTokenTitle] = useState('Minima');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenSendable, setTokenSendable] = useState(0);
  const inputToken = useRef(null);

  const [showToken, setShowToken] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSendTokenBut, setShowSendTokenBut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const notifyRef = useRef(null);
  const imageMimeType = /image\/(png|jpg|jpeg|webp)/i;


  const onButtonClick = () => {   
  //  console.log("Send token window");
   setShowToken(!showToken);
   setShowSuccess(false);
   setShowPending(false);
   setShowMenu(false);
   setShowSendTokenBut(false);
   inputToken.current.value = "";
  };

  const onMenuClick = () => {   
    setShowMenu(!showMenu);
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

  const submitToken = (e) => {
    // console.log("Submit token", showSuccess)
    e.preventDefault();

    Decimal.set({ precision: 60 });

    const tokenid = tokenID;
    const tokenamount = inputToken.current.value;
    const tokenname = tokenTitle;


    if(tokenamount > tokenSendable){      
      alert("Insufficient funds...");
      return;
    }

    if(tokenamount == "" || tokenamount < 0 || tokenamount == 0 ){
      alert("Invalid amount...");
      // notifyRef.current.notifyMessage("Invalid amount...", "error");
      return;
    }

    if(tokenid == ""){
      alert("Please select token...");
      // notifyRef.current.notifyMessage("Please select token...", "error");
      return;
    }

    const roundedAmount = new Decimal(tokenamount).toDecimalPlaces(18).toString();
    setTokenAmount(tokenamount);
    setShowMenu(false);
    setShowSendTokenBut(true);

    const tokenamountsend = new Decimal(inputToken.current.value);
    // console.log("Amount"+roundedAmount);

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
          //Is it pending..
          if(resp.pending){
            // alert("This transaction is now pending!");
            tokenSendData('Transaction pending of');
            setTimeout(function() {
              setShowPending(true);
              setShowSendTokenBut(false);
            }, 1000);
          }else{
            window.MDS.log(JSON.stringify(resp));
            // alert("ERROR : "+resp.message);
            return;	
          }	
        }
        if(resp.status == true){
          // alert("Transaction successful!");
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
  
  const tokenHandler = (name, id, sendable) => {
    // console.log(name, id)
    setTokenSendable(sendable);
    setActive(name);
    setTokenTitle(name);
    setTokenID(id);
  }

  const deleteMessages = () =>{  
    //Delete messages from Room
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

  const getMaximaContact = ( )=>{
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

            <UserProfile deleteContact={deleteContact} roomName={roomName} lastSeen={lastSeen} deleteMessages={deleteMessages} publicRoomKey={publicRoomKey} showUserProfile={showUserProfile} setShowUserProfile={setShowUserProfile} />

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
                        <Avatar className="chat-msg-img" name={item.ROOMNAME === item.USERNAME ? item.ROOMNAME : item.USERNAME} size={40} round={true} maxInitials={2}/>
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
                          <span>{item.MESSAGE === "Chat" ? null: linkOutput(decodeURIComponent(item.MESSAGE).replace("%27", "'")) }</span>
                        </div>
                      </div>
                      </div>
                      }
                    </div>
                  ))
                  )}

                <div className={`send-tokens-window ${showToken ? "" : "hide"}`}>
                    <div className='close-window' onClick={onButtonClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div className='send-tokens-window-header'>Enter amount</div>
                    <div className='send-tokens-window-number'>
                      <input ref={inputToken} onChange={(event) => event.target.value < 0 ? event.target.value = 0 : event.target.value} placeholder="0" type="number" pattern="\d*" min="0" />
                    </div>
                    <div className='send-tokens-window-balance'>
                      {getBalance.map(((item, index)=>(
                        <div className={`send-tokens-window-balance-item ${active === tokenName(item.token.name) && 'active'}`} key={index} onClick={() => tokenHandler(tokenName(item.token.name), item.tokenid, item.sendable)}>
                          <div className='token-logotype'><img src={tokenUrl(item.token.url)} alt="" /></div>
                          <div className='token-details'>
                            <div className='token-name'>{tokenName(item.token.name)}</div>
                            <div className='token-balance'>{item.token.ticker}</div>
                            <div className='token-balance'>{item.sendable}</div>
                            
                          </div>
                        </div>
                      )))}
                    </div>
                    <button onClick={submitToken} disabled={showSendTokenBut} className="minima-btn btn-fill-blue-medium">Send</button>
                    <button onClick={onButtonClick} className="minima-btn btn-fill-black-medium">Cancel</button>

                    <ShowPending showPending={showPending} tokenAmount={tokenAmount} tokenTitle={tokenTitle} onButtonClick={onButtonClick} />
                    <ShowSuccess showSuccess={showSuccess} tokenAmount={tokenAmount} tokenTitle={tokenTitle} onButtonClick={onButtonClick} />

                </div>

                <div className="chat-area-footer">
                  <div className={`chat-area-footer-menu ${showMenu ? "" : "hide"}`}>
                        <div className='close-menu' onClick={onMenuClick}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                        <div className='chat-area-footer-menu-item' onClick={onButtonClick}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 20V4M17 4L20 7M17 4L14 7" stroke="#91919D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 4V20M7 20L10 17M7 20L4 17" stroke="#91919D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Send tokens
                        </div>
                        <div className='chat-area-footer-menu-item'>
                          <label htmlFor="file-input">
                            <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.03571 18.5714C4.38509 18.5714 2.96648 17.9833 1.77989 16.8071C0.593295 15.631 0 14.2071 0 12.5357C0 11.0089 0.505638 9.66754 1.51691 8.51166C2.5277 7.35627 3.77594 6.69611 5.26166 6.5312C5.61278 4.63246 6.5156 3.06924 7.97011 1.84154C9.42512 0.613848 11.1122 0 13.0312 0C15.239 0 17.0961 0.784209 18.6026 2.35263C20.1086 3.92055 20.8617 5.80865 20.8617 8.01691V9.00714H21.2331C22.5747 9.00714 23.7046 9.46623 24.6227 10.3844C25.5409 11.3026 26 12.4325 26 13.7741C26 15.0944 25.5357 16.224 24.6071 17.163C23.6786 18.1019 22.5539 18.5714 21.2331 18.5714H14.1455C13.6294 18.5714 13.1805 18.3805 12.7987 17.9987C12.4169 17.6169 12.2259 17.1578 12.2259 16.6214V9.0688L9.65714 11.6383L8.54286 10.5545L13 6.06691L17.4571 10.5545L16.3429 11.6383L13.7741 9.0688V16.6214C13.7741 16.7244 13.8152 16.8173 13.8974 16.9C13.9801 16.9827 14.0628 17.0241 14.1455 17.0241H21.2026C22.1104 17.0241 22.879 16.7093 23.5085 16.0799C24.1379 15.4504 24.4526 14.6818 24.4526 13.7741C24.4526 12.8866 24.1379 12.1281 23.5085 11.4987C22.879 10.8692 22.1104 10.5545 21.2026 10.5545H19.3143V8.01691C19.3143 6.24198 18.7004 4.72531 17.4727 3.46691C16.245 2.20802 14.7437 1.57857 12.9688 1.57857C11.1944 1.57857 9.6933 2.20802 8.4656 3.46691C7.23791 4.72531 6.62406 6.24198 6.62406 8.01691H5.97406C4.77707 8.01691 3.74004 8.45025 2.86297 9.31691C1.9859 10.1836 1.54737 11.2565 1.54737 12.5357C1.54737 13.753 1.9859 14.8054 2.86297 15.6929C3.74004 16.5803 4.79762 17.0241 6.03571 17.0241H9.75V18.5714H6.03571Z" fill="#91919D"/></svg>
                            Send image
                          </label>
                        </div>
                  </div>
                  <form data-testid="form-submit" onSubmit={submitHandle}>
                    {baseImage ? <img src={baseImage} height="32px" width="32px" alt="" /> : "" }
                    <svg onClick={onMenuClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <input id="file-input" type="file" accept="image/*"
                      onChange={(e) => {
                        uploadImage(e);
                      }}
                      style={{display: 'none'}}
                      onClick={e => (e.target.value = null)}
                    />
                    <input data-testid="input-text" onChange={(e) => {setMessageData(e.target.value)} } type="text" placeholder="Write a message" value={messageData} />
                    <svg className='form-send' onClick={submitHandle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  </form>
                </div>
          </div>
          <ScrollBottom/>
        </div>
    
    </>
  ) 

}

export default ChatArea;