import React from 'react';
import Slider from "react-slick";
import WelcomeData from '../../data/welcome/SplashData.json';
import Logoimage from '../../assets/images/maxsolo_blue_logo.svg'

const SlideData = WelcomeData[0];

var slideSettings = {
    infinite: false,
    speed: 900,
    autoplaySpeed: 3700,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: false,
    centerMode: true,
    arrows: false,
    dots: true,
    swipeToSlide: true,
    draggable: false

    // responsive: [
    //     {
    //       breakpoint: 991,
    //       settings: {
    //         slidesToShow: 1,
    //         variableWidth: false
    //       }
    //     }
    // ]
}

const WelcomeMaxSolo = () => {

    return (
        <>
        <div className={`section welcome-maxsolo`} > 
            <div className='maxsolo-logotype'>
                <img className="light-version-logo" src={Logoimage} alt="logo" />
            </div>            
            <div className="maxsolo-slider">
                <Slider {...slideSettings} className="slick-dot-nav">
                    {SlideData.slice(0, 3).map((data) => (
                        <div className="single-slide" key={data.id}>
                                <img src={`${process.env.PUBLIC_URL}${data.width_img}`} alt="MaxSolo Welcome" />
                                <div className='banner-content'>
                                    <div className='title'>{data.title}</div>
                                </div>
                        </div>
                    ))}
                </Slider> 
            </div>
        </div>
        </>
    )
}

export default WelcomeMaxSolo;