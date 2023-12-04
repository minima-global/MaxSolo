/**
 * MAXCHAT utility functions
 *
 * @spartacusrex
 */

import { keyframes } from "@emotion/react";
import MinimaSign from "../assets/images/minima-sign.svg";
import { useEffect } from "react";

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

const hexToUtf8 = (s) => {
  return decodeURIComponent(
    s
      .replace(/\s+/g, "") // remove spaces
      .replace(/[0-9A-F]{2}/g, "%$&") // add '%' before each 2 characters
  );
};

const utf8ToHex = (s) => {
  const rb = utf8encoder.encode(s);
  let r = "";
  for (const b of rb) {
    r += ("0" + b.toString(16)).slice(-2);
  }
  return r;
};

const getTime = (date) => {
  const rawDate = new Date(parseInt(date, 10));
  const dateTime = rawDate.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return dateTime;
};

const tokenName = (item) => {
  if (item === undefined) {
    return "Minima";
  } else {
    return item;
  }
};

const tokenUrl = (item) => {
  if (item === undefined) {
    return MinimaSign;
  } else {
    return item
      .replace("<artimage>", "data:image/jpeg;base64,")
      .replace("</artimage>", "");
  }
};

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
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

function showNotification(from, message) {
  //Only show if we can''t see it..
  if (document.visibilityState !== "visible") {
    // If it's okay let's create a notification
    if (
      Notification &&
      "permission" in Notification &&
      Notification.permission === "granted"
    ) {
      const notification = new Notification(from, {
        body: message,
        icon: "./minimalogo.png",
      });
    }
  }
}

const RE_URL = /\w+:\/\/\S+/g;

function linkOutput(str) {
  let match;
  const results = [];
  let lastIndex = 0;
  while ((match = RE_URL.exec(str))) {
    const link = match[0];
    if (lastIndex !== match.index) {
      const text = str.substring(lastIndex, match.index);
      results.push(<span key={results.length}>{text}</span>);
    }
    results.push(
      <a key={results.length} href={link} target="_blank" rel="noreferrer">
        {link}
      </a>
    );
    lastIndex = match.index + link.length;
  }
  if (results.length === 0) {
    return str;
  }
  if (lastIndex !== str.length) {
    results.push(<span key={results.length}>{str.substring(lastIndex)}</span>);
  }
  return results;
}

export {
  revealAnim,
  tokenName,
  tokenUrl,
  openInNewTab,
  hexToUtf8,
  utf8ToHex,
  getTime,
  ClickOutside,
  linkOutput,
  showNotification,
};
