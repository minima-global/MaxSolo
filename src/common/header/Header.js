import React from 'react';
import Logo from '../../elements/logo/Logo';
import StickyHeader from './StickyHeader';
import Logoimage from '../../assets/images/maxsolo_logo.svg'
import { Reveal } from "react-awesome-reveal";
import { revealAnim } from '../../utils';
import SwitcherHeader from '../../elements/switcher/SwitcherHeader';


const Header = () => {

    const sticky = StickyHeader(50);
    
    return (
        <>
            <header className="header minima-header header-style">
                <div className={`minima-mainmenu ${sticky.scrollStatus.scrollDirection === "up" ? "minima-sticky" : ""} ${sticky.scrollStatus.scrollDirection === "down" ? "top" : ""}` }>
                    <div className="container">
                        <div className="header-navbar">
                            <Reveal keyframes={revealAnim} triggerOnce>
                                <div className="header-logo">
                                    <img className="light-version-logo" src={Logoimage} alt="logo" />
                                    <img className="dark-version-logo" src={Logoimage} alt="logo" />
                                    {/* <Logo limage={Logoimage}
                                    dimage={Logoimage}
                                    simage={Logoimage}
                                    /> */}
                                </div>
                            </Reveal>
                            <div className="header-main-nav">
                            </div>
                            <div className="header-action">
                                <ul className="list-unstyled">
                                    <Reveal keyframes={revealAnim} triggerOnce>
                                        <li className="header-btn">
                                            {/* <a className="minima-btn btn-fill-orange-medium" href="/" target="_blank" rel="noopener noreferrer">Exit</a> */}
                                        </li>
                                        <li className="my_switcher d-block">
                                            <SwitcherHeader />
                                        </li>
                                    </Reveal>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;