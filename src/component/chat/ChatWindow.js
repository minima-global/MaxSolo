import React, { useState, useEffect, useCallback } from "react";
import { utf8ToHex, hexToUtf8, getTime, showNotification } from "../../utils";
import { events } from "./../../minima/libs/events";
import WelcomeLoader from "../../elements/loader/WelcomeLoader";
import SideBar from "./SideBar/SideBar";
import ChatArea from "./ChatArea/ChatArea";
import LoaderSpin from "../../elements/loader/LoaderSpin";

import { format } from "date-fns";

const ChatWindow = () => {
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [getBalance, setGetBalance] = useState([]);
  const [getMinimaAddress, setGetMinimaAddress] = useState("");
  const [getCurrentAddress, setGetCurrentAddress] = useState("");
  const [getContactId, setGetContactId] = useState("");
  const [publicRoomKey, setPublicRoomKey] = useState("");
  const [roomName, setRoomName] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [responseName, setResponseName] = useState("");
  const [responseContact, setResponseContact] = useState("");

  const getContacts = useCallback(() => {
    window.MDS.cmd("maxima", function (result) {
      setResponseName(result.response.name);
      setResponseContact(result.response.contact);
    });

    window.MDS.cmd("balance", function (result) {
      //Get the balance
      setGetBalance(result.response);
    });

    restartChatContacts();
    loadLastMessage();
  }, []);

  const restartChatContacts = () => {
    window.MDS.cmd("maxcontacts", function (result) {
      //Get contacts
      setContacts([...result.response.contacts]);
    });
  };

  const restartContacts = () => {
    setIsChatLoading(true);
    setTimeout(function () {
      // console.log("Contacts restarted")
      getContacts();
    }, 5000);
  };

  events.onMaxima((maximaMessage) => {
    // console.log("Listener", maximaMessage, maximaMessage.application);
    if (maximaMessage.application == "maxsolo") {
      let pubkey = maximaMessage.from;

      if (pubkey === publicRoomKey) {
        loadMessages(publicRoomKey);
      }

      loadLastMessage();

      // console.log(contacts.length, lastMessage.length);

      // if(contacts.length !== lastMessage.length){
      //   restartContacts();
      // }

      var datastr = maximaMessage.data.substring(2);
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

  const getPublicKey = (roomkey, roomname) => {
    // console.log("Room key", roomkey);
    setPublicRoomKey(roomkey);
    loadMessages(roomkey);
    setRoomName(roomname);
    setIsChatLoading(false);

    if (contacts.length > 0) {
      let lastArr = [];
      lastArr = contacts.filter((data) => data.publickey === roomkey);

      setGetMinimaAddress(lastArr[0]?.extradata.minimaaddress);
      setLastSeen(getTime(lastArr[0]?.lastseen));
      setGetCurrentAddress(lastArr[0]?.currentaddress);
      setGetContactId(lastArr[0]?.id);
    }

    // Set all messages to read
    window.MDS.sql(
      "UPDATE messages SET READ=1 WHERE publickey='" + roomkey + "'"
    );
    loadLastMessage();
  };

  const sendData = (jsondata) => {
    //Convert to a string..
    var datastr = JSON.stringify(jsondata);

    //And now convert to HEX
    var hexstr = "0x" + utf8ToHex(datastr).toUpperCase().trim();

    //Create the function..
    var fullfunc =
      "maxima action:send publickey:" +
      publicRoomKey +
      " application:maxsolo data:" +
      hexstr;

    //Send the message via Maxima!
    window.MDS.cmd(fullfunc, function (resp) {
      // console.log("Response status is: ", resp);
      if (resp.status === false) {
        alert(resp.error);
        // window.MDS.log(JSON.stringify(resp));
      } else if (resp.response.delivered === false) {
        alert(resp.response.error);
        // window.MDS.log(JSON.stringify(resp));
      } else {
        //And add it to Our DB..
        insertMessage(
          roomName,
          publicRoomKey,
          responseName,
          jsondata.type,
          jsondata.message,
          jsondata.filedata,
          function () {
            //Load all the messages
            loadMessages(publicRoomKey);
          }
        );
        loadLastMessage();
      }
    });
  };

  function insertMessage(
    roomname,
    frompubkey,
    name,
    type,
    message,
    filedata,
    callback
  ) {
    //Url encode the message
    let encoded = encodeURIComponent(message).replace("'", "%27");

    var fullsql =
      "INSERT INTO messages (roomname, publickey, username, type, message, filedata, date) VALUES " +
      "('" +
      roomname +
      "','" +
      frompubkey +
      "','" +
      name +
      "','" +
      type +
      "','" +
      encoded +
      "','" +
      filedata +
      "', " +
      Date.now() +
      ")";

    window.MDS.sql(fullsql, function (resp) {
      //WE have the reply..
      callback();
    });
  }

  function loadMessages(key) {
    //Load the last messages in each room..
    window.MDS.sql(
      "SELECT * from messages WHERE publickey='" +
        key +
        "' ORDER BY ID DESC LIMIT 200",
      function (sqlmsg) {
        if (sqlmsg.status) {
          const messages = sqlmsg.rows;

          /**
           * {
            "ID": "1",
            "ROOMNAME": "eurobuddha",
            "PUBLICKEY": "0x30819F300D06092A864886F70D010101050003818D0030818902818100BEA9651581EFD72C3150983F4D4FB21786475406B62896A00FA278D8254645D7359BCD3AEEC30B035E162BAF3DD0C7F2269F53989917151F8B8A769559BA8692BB85D2C077C762147FD8F1405A7145C903CE7505E01E149D6D68ACEF7C445C14558810FF1103BE060DE37DDE66817BFAB12C016FD711E17641E0CB0ECEA363B90203010001",
            "USERNAME": "Elias",
            "TYPE": "text",
            "MESSAGE": "Hello",
            "FILEDATA": "",
            "CUSTOMID": "0x00",
            "STATE": "",
            "READ": "1",
            "DATE": "1701685320919"
            }
           */
          let dataByDate: {
            [key: string]: {
              ID: string,
              ROOMNAME: string,
              PUBLICKEY: string,
              USERNAME: string,
              TYPE: string,
              MESSAGE: string,
              FILEDATA: string,
              CUSTOMID: string,
              STATE: string,
              READ: string,
              DATE: string,
            },
          } = {};

          messages.reverse().map((message) => {
            const date = format(parseInt(message.DATE), "MMMM do yyyy");

            if (dataByDate[date]) {
              // then add message
              return dataByDate[date].push(message);
            }
            // otherwise add as first message
            const firstMessage = [message];
            dataByDate = {
              ...dataByDate,
              [date]: firstMessage,
            };
          });

          setChatData(dataByDate);
        }
      }
    );
  }

  function loadLastMessage() {
    // window.MDS.sql("SELECT * from messages WHERE ID in "
    window.MDS.sql(
      "SELECT * from messages WHERE ID in " +
        "( SELECT max(ID) FROM messages GROUP BY publickey ) ORDER BY ID DESC",
      function (sqlmsg) {
        //Get the data
        if (sqlmsg.status) {
          let sqlrows = sqlmsg.rows;
          setLastMessage([...sqlrows]);
        }
      }
    );
  }

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  return (
    <>
      {responseName ? (
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
          {isChatLoading ? (
            <WelcomeLoader />
          ) : (
            <ChatArea
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
            />
          )}
        </div>
      ) : (
        <LoaderSpin />
      )}
    </>
  );
};

export default ChatWindow;
