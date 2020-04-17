//Cookie Banner
document.querySelector('.cookie-button').addEventListener('click', function(){
    document.cookie = "cookieConsent = accepted";
    document.querySelector('.cookie-consent').style.display = 'none';
})

var cookies = document.cookie
                .split(';')
                .map(cookie => cookie.split('='))
                .reduce((acc, [key, value]) =>
                    ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});


if(cookies.cookieConsent === 'accepted') {
    document.querySelector('.cookie-consent').style.display = 'none';
}