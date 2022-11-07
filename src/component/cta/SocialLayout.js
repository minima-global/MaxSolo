import React from 'react';
// import { Fade } from "react-awesome-reveal";
import { Reveal } from "react-awesome-reveal";
import { revealAnim } from '../../utils';

const CtaLayoutOne = () => {

    return (

        <div className='section section-padding bg-color-blue p--0'>
            <Reveal keyframes={revealAnim}>
            <div className='container social'>
                <div className='social-title'>
                    <h4>Join the community</h4>
                </div>
                <div className='social-icons'>
                    <a href="https://discord.com/invite/minima" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/discord.svg"} alt="Discord" /></a>
                    <a href="https://t.me/Minima_Global" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/telegram.svg"} alt="Discord" /></a>
                    <a href="https://github.com/minima-global" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/github.svg"} alt="Discord" /></a>
                    <a href="https://twitter.com/Minima_Global" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/twitter.svg"} alt="Discord" /></a>
                    <a href="https://www.youtube.com/channel/UCDe2j57uQrUVtVizFbDpsoQ" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/youtube.svg"} alt="Discord" /></a>
                    <a href="https://medium.com/minima-global" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/medium.svg"} alt="Discord" /></a>
                    <a href="https://www.coingecko.com/en/coins/minima" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/gecko.svg"} alt="Discord" /></a>
                    <a href="https://coinmarketcap.com/currencies/minima-global/" target="_blank" rel="noopener noreferrer"><img src={process.env.PUBLIC_URL + "/images/social/cap.svg"} alt="Discord" /></a>
                </div>
            </div>
            </Reveal>
        </div>
    )

}

export default CtaLayoutOne;