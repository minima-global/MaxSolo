import React, { useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { events } from "./minima/libs/events";
import Loader from './elements/loader/Loader';


// DashBoard Import
import DashBoard from './pages/DashBoard';

// Css Import
import './assets/scss/app.scss';

const App = () => {

  const [isMDSLoading, setIsMDSLoading] = useState(true);

  useEffect(() => {
    events.onInit(() => {
      console.log(`minima onInit`);
      setIsMDSLoading(false);
    });
  }, []);

  return (
    <>
      {isMDSLoading ? <Loader /> : <DashBoard />}
    </> 
  )
}

export default App;