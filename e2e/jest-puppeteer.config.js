module.exports = {
    launch: {
        ignoreHTTPSErrors: true,
        headless: false,
        slowMo: 15,
        defaultViewport: null,
        args: [
            '--ignore-certificate-errors',
            '--disable-web-security',
        ]
    },
}
