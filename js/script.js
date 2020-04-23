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

// Line Count 

var consoleHeight = document.querySelector('.console-box').offsetHeight;

function lineCount() {
    var consoleLine = consoleHeight / 20;
    for (i = 1; i < consoleLine - 1; i++) {
        document.querySelector('.line-count').insertAdjacentHTML('beforeend', '<ul>' + i + '</ul>'); 
    }
}

lineCount();

// Editor Animation
// var windowHeight = window.innerHeight;
// document.querySelector('.info').style.transform = "translateY(" + windowHeight / 3 + "px)";


// document.querySelector('.button-editor').addEventListener('click', function(){
//     this.classList.toggle('open');
//     document.querySelector('.editor').classList.toggle('fade-in');
//     document.querySelector('.editor').style.transform = "translateY(" + windowHeight / 10 + "px)";
//     document.querySelector('.info').style.transform = "translateY(" + windowHeight / 6 + "px)";
// })

// document.querySelector('.close').addEventListener('click', function(){
//     document.querySelector('.editor').classList.toggle('fade-in');
// })
