// ==UserScript==
// @name         GTool Idle Updater
// @namespace    http://oplanet.eu
// @version      0.1.2
// @description  Idle updater for GalaxyTool
// @author       Crypto
// @match        https://*.ogame.gameforge.com/game/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var timeout = parseInt(localStorage.getItem('gtiu-timeout')) || 600;
var delay = parseInt(localStorage.getItem('gtiu-delay')) || 500;

$(document).on('giu-ticker', function (event, ms) {
    ms = ms - 1000;
    
    $('li#menu-giu span.textLabel').text('GIU: '+ ms/1000);
    
    if (ms > 0) {
        setTimeout(function() { $(document).trigger('giu-ticker', ms); }, 1000);
    }
    else {
        localStorage.setItem('gtiu-update', 1);
        document.location.href = document.location.origin+"/game/index.php?page=galaxy";
    }
});

$(document).on('overview', function (event) {
    console.log('event: overview');
    
    var r_timeout = timeout + Math.floor(Math.random() * 300);

    $("ul#menuTableTools").append('<li id="menu-giu"><span class="menu_icon"><div class="menuImage galaxy"></div></span><a href="#" class="menubutton"><span class="textLabel" style="color: #ff9600;">GIU: '+r_timeout+'</span></a></li>');
    
    setTimeout(function() {
        console.log('event: start-ticker');
        $(document).trigger('giu-ticker', r_timeout*1000);
    }, 1000);
});

$(document).on('galaxy', function(event) {
    // check if this was due to idle timeout
    if (!(localStorage.getItem('gtiu-update') == 1)) {
        return;
    }
    
    // disable update
    localStorage.setItem('gtiu-update', 0);
    
    // generate random galaxy
    var galaxy = Math.floor(Math.random() * 9) + 1;
    
    for (var s=1; s<500; s++) {
        // make this slightly more random
        // generates a value for delay +- 50
        var r_delay = delay + (Math.floor(Math.random() * 100) - 50);
        setTimeout(
            loadContent.bind(null, galaxy, s, true),
            s * r_delay
        );
    }
    
    // return to main page
    setTimeout(
        function() {
            document.location.href = document.location.origin+"/game/index.php?page=overview";
        },
        501 * delay
    );
});

$(document).trigger(document.location.search.match(/page=([^&]+)/)[1]);
