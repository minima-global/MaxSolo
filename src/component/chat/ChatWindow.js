import React, {useState, useEffect, useCallback } from 'react';
import { utf8ToHex, getTime, showNotification } from '../../utils';
import { events } from "./../../minima/libs/events";
import WelcomeLoader from '../../elements/loader/WelcomeLoader';
import SideBar from './SideBar/SideBar';
import ChatArea from './ChatArea/ChatArea';

const ChatWindow = () => {

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [getBalance, setGetBalance] = useState([]);
  const [getMinimaAddress, setGetMinimaAddress] = useState('');
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

    window.MDS.cmd("maxcontacts",function(result){  
      //Get contacts  
      console.log("Get contacts", result.response.contacts);
      setContacts([...result.response.contacts]);
      setIsChatLoading(true);

      window.MDS.sql("SELECT * from messages WHERE ID in "
      +"( SELECT max(ID) FROM messages GROUP BY publickey)", function(sqlmsg){
        //Get the Array
        // console.log("DB before filtering", sqlmsg.rows)
        if(sqlmsg.status){

            // Check if existing contact updated name in Maxima
            const newnameref = sqlmsg.rows.reduce((obj, o) => (obj[o.ROOMNAME] = true, obj), {});
            const newname = result.response.contacts.filter(o => !newnameref[o.extradata.name]);   
            
            // Check local DB if contact deleted from Maxima
            const dbref = result.response.contacts.reduce((obj, o) => (obj[o.publickey] = true, obj), {});            
            const dbkeys = sqlmsg.rows.filter(o => !dbref[o.PUBLICKEY]);

            // Check Maxima for a new contact
            const contactsref = sqlmsg.rows.reduce((obj, o) => (obj[o.PUBLICKEY] = true, obj), {});
            const newkeys = result.response.contacts.filter(o => !contactsref[o.publickey]);

            if(dbkeys.length > 0){
              dbkeys.map(((item)=>(
                window.MDS.sql("DELETE from messages WHERE publickey='"+item.PUBLICKEY+"'", function(sqlmsg){      
                  if(sqlmsg.status){
                    // console.log("Deleted from DB", item.PUBLICKEY, item.ID, item.ROOMNAME)
                  }
                })  
              )));
            }

            if(newkeys.length > 0){
              newkeys.map(((item)=>(
                insertMessage(item.extradata.name, item.publickey, responseName, 
                  "text", "Chat", "", function(){
                    // console.log("Adding a new contact", item.extradata.name, item.publickey, item.id)
                })
              )));
            }

            if(newname.length > 0){
              newname.map(((item)=>(
                window.MDS.sql("UPDATE messages SET ROOMNAME = '"+item.extradata.name+"' WHERE publickey='"+item.publickey+"'", function(sqlmsg){      
                  if(sqlmsg.status){
                    // console.log("Updated name in DB for", item.publickey, item.id, item.extradata.name)
                  }
                })  
              )));
            }

            loadLastMessage();
        }
      });
    });

    window.MDS.cmd("balance",function(result){
      setGetBalance(result.response);
      // console.log(result.response);
    });
    
  }, []);

  const restartContacts = () => {
    setTimeout(function() {
      console.log("Contacts restarted")
      getContacts();
    }, 5000);
  }

  events.onMaxima((maximaMessage) => {
    console.log("Listener", maximaMessage);
    let pubkey = maximaMessage.from;
    
    if(pubkey === publicRoomKey){
      loadMessages(publicRoomKey);
    }

    loadLastMessage();

    if(contacts.length !== lastMessage.length){
      restartContacts();
    }

    if(maximaMessage.type=="text"){
      showNotification(maximaMessage.username, maximaMessage.message);	
    }else{
      showNotification(maximaMessage.username, "IMAGE");
    }
  });

  const getPublicKey = (roomkey, roomname) =>{
    // console.log("Room key", roomkey)
    setPublicRoomKey(roomkey);
    loadMessages(roomkey);
    setRoomName(roomname);
    setIsChatLoading(false);

    if(contacts.length > 0){
      let lastArr = [];
      lastArr = contacts.filter(data => data.publickey === roomkey);   
      setGetMinimaAddress(lastArr[0]?.extradata.minimaaddress);
      setLastSeen(getTime(lastArr[0]?.lastseen));
    }

    // console.log("Making message read 1", roomkey)
    //Set all messages to read
    window.MDS.sql("UPDATE messages SET READ=1 WHERE publickey='"+roomkey+"'");
    loadLastMessage(); 
  }

  const sendData = (jsondata) =>{

    // console.log(jsondata)
	
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
        setIsChatLoading(false);
        setChatData(sqlmsg.rows.reverse());
      }
    }); 
  }

  function loadLastMessage(){
    // console.log("Loaded last messages")
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

  // Detecting App is hidden or not, for sending notifications.

  useEffect(() => {
    setInterval(() => {
      if(document.hidden) {
        window.MDS.comms.solo(JSON.stringify({ target: "service", keepAlive: false }));
      }else{
        window.MDS.comms.solo(JSON.stringify({ target: "service", keepAlive: true }));
      }
    }, 30000);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClosing)
    return () => {
        window.removeEventListener('beforeunload', handleTabClosing)
    }
  })

  const handleTabClosing = () => {
    window.MDS.comms.solo(JSON.stringify({ target: "service", keepAlive: true }));
  }


 
    return (
		<>
        <div className="maxsolo-wrapper">
                {/* <div className='main-notification'>
                  <NotificationSidebar ref={notifyRef} />
                </div> */}
                <SideBar 
                lastMessage={lastMessage} 
                contacts={contacts} 
                getPublicKey={getPublicKey} 
                roomName={roomName}
                restartContacts={restartContacts}
                responseContact={responseContact}
                responseName={responseName}
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
                responseName={responseName}
                restartContacts={restartContacts}
                />
                }
        </div>
		</>
    )
}

export default ChatWindow;