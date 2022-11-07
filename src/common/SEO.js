import React from 'react'
import PropTypes from "prop-types";


const SEO = ( {title} ) => {
    return (
        <>
            <meta charSet="utf-8" />
            <title>Minima MiniDapps | {title}</title>
            <meta name="robots" content="noindex, follow" />
            <meta name="description" content="Minima MiniDapps" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </>
    )
}
SEO.propTypes = {
    title: PropTypes.string
};

export default SEO;