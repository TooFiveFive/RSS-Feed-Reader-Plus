const {ipcRenderer} = require('electron');

document.getElementById('list').style.height = window.innerHeight - 70 + "px";
document.getElementById('container').style.height = window.innerHeight - 20 + "px";
document.getElementById('container').style.width = window.innerWidth - 270 + "px";
window.onresize = () => {
    document.getElementById('list').style.height = window.innerHeight - 70 + "px";
    document.getElementById('container').style.height = window.innerHeight - 20 + "px";
    document.getElementById('container').style.width = window.innerWidth - 270 + "px";
};

document.getElementById('drawer').getElementsByTagName('span')[0].addEventListener('click', () => {
    ipcRenderer.send('add-page', 'yes');
});

document.getElementById('drawer').getElementsByTagName('span')[1].addEventListener('click', () => {
    ipcRenderer.send('settings-page', 'yes');
});

document.onload = ipcRenderer.send('refresh');

var enter = document.getElementById('list');

ipcRenderer.on('refreshed', (event, response) => {

    refresh(response);
    ipcRenderer.send('reload', {get: 'latest', num: 10});

});

ipcRenderer.on('refreshed-new', (event, response) => {

    enter.innerHTML = "";
    refresh(response);
    ipcRenderer.send('reload', {get: 'latest', num: 10});

});

var refresh = (response) => {

    if (response.length != 0) {

        for (x in response) {

            var img  = extractHostname(response[x].link);

            enter.innerHTML += `
    
<div class="item" oncontextmenu="rcl(` + x + `, event)">
    <span>` + response[x].title + `</span>
    <i><img src="https://www.google.com/s2/favicons?domain=` + img + `">` + response[x].link + `</i>
</div>
    
            `;
        }

    } else {
        enter.innerHTML += '<i class="nothing">No feeds found</i>';
    }
    
    enter.innerHTML += '<div class="break"></div>';

};


document.getElementById('rcl-back').onclick = () => {

    var rcl = document.getElementById('rcl');
    var rclb = document.getElementById('rcl-back');

    rcl.style.display = "none";
    rclb.style.display = "none";

    rclb.style.backgroundColor = "rgba(34, 34, 34, 0)";
    rcl.style.border = "3px solid rgba(230, 25, 66, 0)";

    var el = document.getElementById('rcl'),
        elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);
    
}

document.getElementById('rcl-back').oncontextmenu = () => {

    var rcl = document.getElementById('rcl');
    var rclb = document.getElementById('rcl-back');

    rcl.style.display = "none";
    rclb.style.display = "none";

    rclb.style.backgroundColor = "rgba(34, 34, 34, 0)";
    rcl.style.border = "3px solid rgba(230, 25, 66, 0)";

    var el = document.getElementById('rcl'),
        elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);

}

var extractHostname = (url) => {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

module.exports = {

    quit: () => {

        ipcRenderer.send('quit', true);

    },

    link: (snd) => {

        ipcRenderer.send('link', snd);

    },

    opena: (i) => {

        var artcle = document.getElementsByClassName('article')[i];
        artcle.removeAttribute('onclick');
        artcle.style.height = "auto";
        artcle.style.boxShadow = "inset 0px -130px 200px -100px transparent";
        artcle.classList.add("clickeda");
        var title = artcle.getElementsByTagName('span')[0];
        title.classList += " linked";

        var text = document.createElement('p');
        text.textContent = "(Link)";
        title.appendChild(text);
        
        document.getElementsByClassName('artopt')[i].style.display = "block";
        document.getElementsByClassName('artup')[i].style.display = "block";
        artcle.getElementsByTagName('iframe')[0].style.cssText = 'position: inherit;';

        var it = artcle.getElementsByTagName('blockquote')[0].getElementsByTagName('i');
        if (it.length > 0) {
            it[0].style.cursor = "default";
        }

    },

    closea: (i) => {

        var artcle = document.getElementsByClassName('article')[i];
        artcle.removeAttribute('style');
        console.log(artcle.textContent);
        artcle.classList.remove("clickeda");
        var title = artcle.getElementsByTagName('span')[0];
        title.classList.remove("linked");

        var text = title.getElementsByTagName('p')[0];
        title.removeChild(text);
        
        document.getElementsByClassName('artopt')[i].style.display = "none";
        document.getElementsByClassName('artup')[i].style.display = "none";
        artcle.getElementsByTagName('iframe')[0].style.cssText =  'position: relative !important;';

        var it = artcle.getElementsByTagName('blockquote')[0].getElementsByTagName('i');
        if (it.length > 0) {
            it[0].style.cursor = "pointer";
        }

        setTimeout(() => {
            artcle.setAttribute('onclick', "opena(" + i + ")");
        }, 1000);
        
    }

}