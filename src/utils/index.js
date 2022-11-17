/**
* MAXCHAT utility functions
* 
* @spartacusrex
*/

import { keyframes } from "@emotion/react";
import MinimaSign from '../assets/images/minima-sign.svg'
import {useEffect} from 'react';

const revealAnim = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0px, 20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const utf8encoder = new TextEncoder();

const hexToUtf8 = (s) =>
{
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9A-F]{2}/g, '%$&') // add '%' before each 2 characters
  );
}

const utf8ToHex = (s) =>
{
  const rb = utf8encoder.encode(s);
  let r = '';
  for (const b of rb) {
    r += ('0' + b.toString(16)).slice(-2);
  }
  return r;
}

const getTime = (date) => {
  const rawDate = new Date(parseInt(date,10))
  const time = rawDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return time;
};

const tokenName = (item) => {
  if (item === undefined) {
    return "Minima" 
  }else{
    return item;
  }
}

const tokenUrl = (item) => {
  if (item === undefined) {
    return MinimaSign; 
  }else{
    return item.replace('<artimage>','data:image/jpeg;base64,').replace('</artimage>','');
  }
}

function ClickOutside(ref, onClickOutside) {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}


export {revealAnim, tokenName, tokenUrl, openInNewTab, hexToUtf8, utf8ToHex, getTime, ClickOutside};