import { Txpow } from "../types/minima/index";

////////////// response interfaces //////////
interface InitResponse {
  event: "inited";
}

interface MiningResponse {
  event: "MINING";
  data: MiningData;
}
interface MiningData {
  mining: boolean;
  txpow: Txpow;
}

interface NewBlockResponse {
  event: "NEWBLOCK";
  data: NewBlockData;
}

interface MDSTimerResponse {
  event: "MDS_TIMER_10SECONDS";
  data: Object;
}

interface NewBlockData {
  txpow: Txpow;
}

interface MinimaLogResponse {
  event: "MINIMALOG";
  data: MinimaLogData;
}
interface MinimaLogData {
  message: string;
}

interface NewBalanceResponse {
  event: "NEWBALANCE";
  data: NewBalanceData;
}
interface NewBalanceData {
  // TODO
}

interface MaximaResponse {
  event: "MAXIMA";
  data: MaximaData;
}

interface MaximaData {
  application: string;
  data: string;
  from: string;
  msgid: string;
  random: string;
  time: string;
  timemilli: number;
  to: string;
}

//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: NewBlockData) => {
  // console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: MiningData) => {
  // console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: MaximaData) => {
  // console.log("YES MAXIMA event ... please register custom callback", d);
};
// let whenMaxcontacts = (d: MaxcontactsData) => {
//   console.log("YES MAXIMA event ... please register custom callback", d);
// };
let whenNewBalance = (d: NewBalanceData) => {
  // console.log("NEW BALANCE event ... please resgister custom callback", d);
};
let whenInit = () => {
  // console.log("INIT event ... please resgister custom callback");
};
let whenMinimaLog = (d: MinimaLogData) => {
  // console.log("MINIMA LOG event ... please resgister custom callback", d);
};

let whenMDSTimer = (d: any) => {
  // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};

///////////////////////////

const initializeMinima = () => {
  // MDS.DEBUG_HOST = "127.0.0.1";
  // MDS.DEBUG_PORT = 9003;
  // MDS.DEBUG_MINIDAPPID =
  //   "0x4B4AA15854A5340C3F4311D0C08BA1C54CAB903B0B129D3F3127835AC67A2280922890B6A0AFD2C6BD233FE054C372C5E8B4A6CF4A448302D4701264A792F23AFFD7F496A63D79E7F4D9AC75F5B23A1663A95FBCEEB8401D690ABA3160FB73F9542E66F2871D52944DAE5B0DF25812D444AC5920B2DCEC25431CF33B6AD69FAA";

  MDS.init(
    (
      nodeEvent:
        | InitResponse
        | MiningResponse
        | NewBlockResponse
        | MinimaLogResponse
        | NewBalanceResponse
        | MaximaResponse
        | MDSTimerResponse
    ) => {
      // MDS.init((nodeEvent: InitResponse | MaximaResponse) => {

      switch (nodeEvent.event) {
        case "inited":
          // will have to dispatch from here..
          whenInit();
          break;
        case "NEWBLOCK":
          const newBlockData = nodeEvent.data;
          whenNewBlock(newBlockData);
          break;
        case "MINING":
          const miningData = nodeEvent.data;
          whenMining(miningData);
          break;
        case "MAXIMA":
          const maximaData = nodeEvent.data;
          whenMaxima(maximaData);
          break;
        case "NEWBALANCE":
          const newBalanceData = nodeEvent.data;
          whenNewBalance(newBalanceData);
          break;
        case "MINIMALOG":
          const minimaLogeData = nodeEvent.data;
          whenMinimaLog(minimaLogeData);
          break;
        case "MDS_TIMER_10SECONDS":
          const mdstimerdata = nodeEvent.data;
          whenMDSTimer(mdstimerdata);
          break;
        default:
        // console.log(nodeEvent);
        // console.error("Unknown event type: ", nodeEvent);
      }
    }
  );
};

// Do registration
// initializeMinima();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
  whenNewBlock = callback;
}

function onMining(callback: (data: MiningData) => void) {
  whenMining = callback;
}

function onMaxima(callback: (data: MaximaData) => void) {
  whenMaxima = callback;
}

function onNewBalance(callback: (data: NewBalanceData) => void) {
  whenNewBalance = callback;
}

function onInit(callback: () => void) {
  whenInit = callback;
  initializeMinima();
}

function onMinimaLog(callback: (data: MinimaLogData) => void) {
  whenMinimaLog = callback;
}

function onMDSTimer(callback: (data: any) => void) {
  whenMDSTimer = callback;
}

export const events = {
  onNewBlock,
  onMining,
  onMaxima,
  onNewBalance,
  onInit,
  onMDSTimer,
  onMinimaLog,
};
