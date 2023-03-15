import React from 'react';
import MinimaAnimated from '../../assets/images/minima_logo.gif';

const LoaderSpin = () => {
    return (
        <>
            <div className='welcome-loading'>
                <div className="lds-dual-ring"></div>
            </div>
        </>
    )
}

export default LoaderSpin;