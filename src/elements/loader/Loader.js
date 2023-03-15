import React from 'react';
import MinimaAnimated from '../../assets/images/minima_logo.gif';

const Loader = () => {
    return (
        <>
            <div className='welcome-loading'>
                <img className="welcome-loading-animated" src={MinimaAnimated} alt="You are disconnected from MDS" />
                <div className='welcome-loading-copy'>You are disconnected from MDS<br /> Please see <a href="https://docs.minima.global/docs/runanode/troubleshooting" target="_blank" rel="noreferrer">Troubleshooting</a></div>
            </div>
        </>
    )
}

export default Loader;