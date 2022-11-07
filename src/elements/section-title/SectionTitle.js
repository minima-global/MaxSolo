import React from 'react';


const SectionTitle = ({subtitle, title, description, textAlignment, textColor}) => {
    return (
        <div className={`section-heading ${textAlignment} ${textColor}`}>
            <h2 className="title" dangerouslySetInnerHTML={{__html: title}}></h2>
            <div className="subtitle" dangerouslySetInnerHTML={{__html: subtitle}}></div>
            <p dangerouslySetInnerHTML={{__html: description}}></p>
        </div>
    )
}

export default SectionTitle;