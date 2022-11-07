import React, { useState } from 'react';

const LightBox = ({ children, src, alt, Wrapper = 'div', zIndex = 100 }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleIsOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Wrapper onClick={toggleIsOpen}>
			{children}
			{isOpen ?
				<div onClick={toggleIsOpen} className="lightbox-wrapper">
					<img src={src} alt={alt}/>
				</div>
				: null}
		</Wrapper>
	);
};

export default LightBox;