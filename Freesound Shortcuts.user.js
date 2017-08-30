// ==UserScript==
// @name         Freesound Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  adds shortcuts to freesound
// @author       Sebastien Andary
// @match        https://freesound.org/*
// @downloadURL  https://github.com/sebtoun/freesoundshortcuts/raw/master/Freesound%20Shortcuts.user.js
// @updateURL    https://github.com/sebtoun/freesoundshortcuts/raw/master/Freesound%20Shortcuts.user.js
// @grant        none
// ==/UserScript==
//debugger;
(function() {
    'use strict';
    function callback() {
        (function($) {
            var jQuery = $;
            const ids = soundManager.soundIDs;
            const controls = $("a.play");
            const nSamples = ids.length;
            const SKIP_MILLIS = 3000;
            console.log("found " + nSamples + " samples");

            let current = -1;

            function stopCurrent(){
                stopSound(current);
            }
            function scrollTo(i){
                $("html, body").scrollTop($(controls[i]).offset().top - 80);
            }
            function playNext(count) {
                if (current >= 0 && current < nSamples) {
                    stopSound(current);
                }
                current += count;
                if (current >= nSamples) {
                    current -= nSamples;
                }
                if (current < 0) {
                    current += nSamples;
                }
                playSound(current);
            }
            function skipSamples(direction) {
                if (current < 0 && current >= nSamples) {
                    console.log("cannot skip samples");
                    return;
                }
                var sound = soundManager.getSoundById(ids[current]);
                if (sound.playState === 0){
                    sound.play();
                }
                if (sound.paused) {
                    sound.resume();
                }
                var pos = sound.position + direction * SKIP_MILLIS;
                if (pos < 0) pos = 0;
                if (pos > sound.duration) pos = sound.duration - 1;
                sound.setPosition(pos);
            }
            function playSound(i) {
                if (i >= nSamples || i < 0) {
                    console.log("cannot play " + i);
                    return;
                }
                console.log("play "+ i);

                switchOn($(controls[i]));
                scrollTo(i);
                var sound = soundManager.getSoundById(ids[i]);
                sound.stop();
                sound.setPosition(0);
                sound.play();
            }
            function stopSound(i) {
                if (i >= nSamples || i < 0) {
                    console.log("cannot stop " + i);
                    return;
                }
                console.log("stop "+ i);

                switchOff($(controls[i]));
                var sound = soundManager.getSoundById(ids[i]);
                sound.stop();
            }
            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                //console.log(keyName + " pressed");
                if (keyName === 'n'|| keyName === "ArrowDown") {
                    if (keyName === 'ArrowDown') event.preventDefault();
                    playNext(1);
                } else if (keyName === 'p' || keyName === "ArrowUp") {
                    if (keyName === 'ArrowUp') event.preventDefault();
                    playNext(-1);
                } else if (keyName === 'r') {
                    playNext(0);
                } else if (keyName === 's') {
                    stopAll();
                } else if (keyName === 'ArrowRight' || keyName === 'ArrowLeft') {
                    event.preventDefault();
                    skipSamples(keyName === 'ArrowRight' ? 1 : -1);
                }
            });
        })(jQuery.noConflict(true));
    }
    var s = document.createElement("script");
    s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
    if (s.addEventListener) {
        s.addEventListener("load", callback, false);
    } else if (s.readyState) {
        s.onreadystatechange = callback;
    }
    document.body.appendChild(s);
})();
