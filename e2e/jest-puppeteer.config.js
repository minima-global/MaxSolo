module.exports = {
    launch: {
        ignoreHTTPSErrors: true,
        headless: false,
        defaultViewport: null,
        args: [
            '--ignore-certificate-errors',
            '--disable-web-security',
        ]
    },
}
