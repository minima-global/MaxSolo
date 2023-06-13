import { useState, useEffect } from "react";

const useIsMinimaBrowser = () => {
  const [isMinimaBrowser, setAndroidInternalBrowser] = useState(false);

  const openTitleBar = () => {
    if (!isMinimaBrowser) return;

    // eslint-disable-next-line no-undef
    Android.showTitleBar();
  };

  useEffect(() => {
    if (window.navigator?.userAgent?.includes("Minima Browser")) {
      setAndroidInternalBrowser(true);
    }
  }, []);

  return openTitleBar;
};

export default useIsMinimaBrowser;
