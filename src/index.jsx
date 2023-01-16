import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'react-avatar';
import Div100vh from 'react-div-100vh';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider colors={["#9f014e", "#ff99b5", "#7d3b4d", "#ff367c", "#d8003c", "#f20030", "#fda091", "#a80012", "#ff5141", "#8c3317", "#c74d00", "#fe7100", "#cb6300", "#684a30", "#fea440", "#ecac58", "#c18300", "#d9b27b", "#ccaf00", "#575212", "#c2ba6f", "#798e00", "#455707", "#9fc631", "#4e5241", "#5fcd00", "#2f9800", "#1ac700", "#a6bea9", "#00a34f", "#55cf7e", "#385740", "#7ec893", "#006e4f", "#00ab9d", "#0194a3", "#8cc1cb", "#016a7f", "#26c7f2", "#02a5d7", "#66b1ff", "#017cd8", "#225188", "#008cff", "#4e83ff", "#404897", "#4a4987", "#938cff", "#003fd1", "#655bff", "#856dff", "#5b39aa", "#5831bd", "#d48cff", "#9625da", "#6b4071", "#85287c", "#614957", "#d6008c", "#ff0898"]}>
      <Div100vh>
        <App />
      </Div100vh>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
