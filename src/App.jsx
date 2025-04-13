import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { events } from "./minima/libs/events";
import LoaderSpin from "./elements/loader/LoaderSpin";

// DashBoard Import
import DashBoard from "./pages/DashBoard";

// Css Import
import "./assets/scss/app.scss";

const App = () => {
  const [isMDSLoading, setIsMDSLoading] = useState(true);

  useEffect(() => {
    events.onInit(() => {
      // console.log(`minima onInit`);
      setIsMDSLoading(false);

      //Modify messages table if message varchar is 512 to 1024
      window.MDS.sql("ALTER TABLE messages MODIFY COLUMN message varchar(2048)");
    });
  }, []);

  return <>{isMDSLoading ? <LoaderSpin /> : <DashBoard />}</>;
};

export default App;
