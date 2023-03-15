import React, {useState, useEffect, useCallback } from 'react';
import { utf8ToHex, hexToUtf8, getTime, showNotification } from '../../utils';
import { events } from "./../../minima/libs/events";
import WelcomeLoader from '../../elements/loader/WelcomeLoader';
import SideBar from './SideBar/SideBar';
import ChatArea from './ChatArea/ChatArea';
import LoaderSpin from '../../elements/loader/LoaderSpin';

const ChatWindow = () => {

  const [isChatLoading, setIsChatLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [getBalance, setGetBalance] = useState([]);
  const [getMinimaAddress, setGetMinimaAddress] = useState('');
  const [getCurrentAddress, setGetCurrentAddress] = useState('');
  const [getContactId, setGetContactId] = useState('');
  const [publicRoomKey, setPublicRoomKey] = useState('');
  const [roomName, setRoomName] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [responseName, setResponseName] = useState('');
  const [responseContact, setResponseContact] = useState('');

  const getContacts = useCallback(() => {

    window.MDS.cmd("maxima",function(result){
      //Get my name
      window.MDS.log("User : "+ result.response.name + "User key :" + result.response.publickey, result.response.contact);
      setResponseName(result.response.name);
      setResponseContact(result.response.contact);
    }); 

    window.MDS.cmd("balance",function(result){
      //Get the balance
      setGetBalance(result.response);
    });

    restartChatContacts();
    loadLastMessage(); 
    
  }, []); 

  const restartChatContacts = () => {
    window.MDS.cmd("maxcontacts",function(result){  
      //Get contacts  
      setContacts([...result.response.contacts]);
    });
  }

  const restartContacts = () => {
    setIsChatLoading(true);
    setTimeout(function() {
      console.log("Contacts restarted")
      getContacts();
    }, 5000);
  }

  events.onMaxima((maximaMessage) => {
    // console.log("Listener", maximaMessage, maximaMessage.application);
    if(maximaMessage.application == "maxsolo"){

      let pubkey = maximaMessage.from;
    
      if(pubkey === publicRoomKey){
        loadMessages(publicRoomKey);
      }
  
      loadLastMessage();

      console.log(contacts.length, lastMessage.length)
  
      // if(contacts.length !== lastMessage.length){
      //   restartContacts();
      // }

      var datastr	= maximaMessage.data.substring(2);
      // Convert the data..
      var jsonstr = hexToUtf8(datastr);
      // And create the actual JSON
      var maxjson = JSON.parse(jsonstr);
      // URL encode the message and deal with apostrophe..
      let decoded = decodeURIComponent(maxjson.message).replace("%27", "'");
  
      showNotification(maxjson.username, decoded);
    }
  });

  // Detecting App is hidden or not, for sending notifications.
  events.onMDSTimer((time) => {
    window.MDS.comms.solo(JSON.stringify({ appTime: time.timemilli }));
  });

  const getPublicKey = (roomkey, roomname) =>{
    console.log("Room key", roomkey)
    setPublicRoomKey(roomkey);
    loadMessages(roomkey);
    setRoomName(roomname);
    setIsChatLoading(false);

    if(contacts.length > 0){
      let lastArr = [];
      lastArr = contacts.filter(data => data.publickey === roomkey); 

      setGetMinimaAddress(lastArr[0]?.extradata.minimaaddress);
      setLastSeen(getTime(lastArr[0]?.lastseen));
      setGetCurrentAddress(lastArr[0]?.currentaddress);
      setGetContactId(lastArr[0]?.id);
    }

    // Set all messages to read
    window.MDS.sql("UPDATE messages SET READ=1 WHERE publickey='"+roomkey+"'");
    loadLastMessage(); 
  }

  const sendData = (jsondata) =>{
	
    //Convert to a string..
    var datastr = JSON.stringify(jsondata);

    //And now convert to HEX
    var hexstr = "0x"+utf8ToHex(datastr).toUpperCase().trim();
    
    //Create the function..
    var fullfunc = "maxima action:send publickey:"+publicRoomKey+" application:maxsolo data:"+hexstr;
    
    //Send the message via Maxima!
    window.MDS.cmd(fullfunc, function(resp){
      // console.log("Response status is: ", resp);
      if(resp.status === false){
        alert(resp.error);
        window.MDS.log(JSON.stringify(resp));
      }else if(resp.response.delivered === false){
        alert(resp.response.error);
        window.MDS.log(JSON.stringify(resp));
      }else{
        //And add it to Our DB..
        insertMessage(roomName, publicRoomKey, responseName, jsondata.type, jsondata.message, jsondata.filedata, function(){    
          //Load all the messages
          loadMessages(publicRoomKey);	
        });
        loadLastMessage();			
      }
    });
  }

  function insertMessage(roomname, frompubkey, name, type, message, filedata, callback){
	
    //Url encode the message
    let encoded = encodeURIComponent(message).replace("'", "%27");
    
    var fullsql = "INSERT INTO messages (roomname, publickey, username, type, message, filedata, date) VALUES "
        +"('"+roomname+"','"+frompubkey+"','"+name+"','"+type+"','"+encoded+"','"+filedata+"', "+Date.now()+")";
    
    window.MDS.sql(fullsql, function(resp){
      //WE have the reply..
      callback();	
    });
  }

  function loadMessages(key){  
    //Load the last messages in each room..
    window.MDS.sql("SELECT * from messages WHERE publickey='"+key+"' ORDER BY ID DESC LIMIT 200", function(sqlmsg){
      // console.log(sqlmsg.status);
      if(sqlmsg.status){
        setChatData(sqlmsg.rows.reverse());
      }
    }); 
  }

  function loadLastMessage(){
    // window.MDS.sql("SELECT * from messages WHERE ID in "
    window.MDS.sql("SELECT * from messages WHERE ID in "
      +"( SELECT max(ID) FROM messages GROUP BY publickey ) ORDER BY ID DESC", function(sqlmsg){
      //Get the data
      if(sqlmsg.status){
        let sqlrows = sqlmsg.rows;
        setLastMessage([...sqlrows]);
      }
    })
  }

  useEffect(()=>{
    getContacts();
  },[getContacts]);
 
    return (
		<>          
        {responseName ? 
        
        <div className="maxsolo-wrapper">
                <SideBar 
                lastMessage={lastMessage} 
                contacts={contacts} 
                getPublicKey={getPublicKey} 
                roomName={roomName}
                restartContacts={restartContacts}
                responseContact={responseContact}
                responseName={responseName}
                restartChatContacts={restartChatContacts}
                />
                {isChatLoading ? <WelcomeLoader /> : <ChatArea 
                loadMessages={loadMessages} 
                getBalance={getBalance} 
                chatData={chatData} 
                contacts={contacts} 
                roomName={roomName} 
                lastSeen={lastSeen}
                sendData={sendData} 
                publicRoomKey={publicRoomKey} 
                getMinimaAddress={getMinimaAddress} 
                getCurrentAddress={getCurrentAddress}
                getContactId={getContactId}
                responseName={responseName}
                restartContacts={restartContacts}
                />}
        </div> : <LoaderSpin /> }
		</>
    )
}

export default ChatWindow;