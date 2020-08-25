// ==UserScript==
// @name         AtCoder Submission User Colorizer
// @namespace    https://github.com/morioprog
// @version      1.1
// @description  提出一覧のユーザ名を色付けします
// @author       morio_prog
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @license      CC0
// @require      https://unpkg.com/lscache/lscache.min.js
// ==/UserScript==

function getColor(rating) {
    if (rating >= 2800) return '#FF0000';
    if (rating >= 2400) return '#FF8000';
    if (rating >= 2000) return '#C0C000';
    if (rating >= 1600) return '#0000FF';
    if (rating >= 1200) return '#00C0C0';
    if (rating >=  800) return '#008000';
    if (rating >=  400) return '#804000';
    if (rating >=    0) return '#808080';
    return '#000000';
}

function getColorClass(rating) {
    if (rating >= 2800) return 'user-red';
    if (rating >= 2400) return 'user-orange';
    if (rating >= 2000) return 'user-yellow';
    if (rating >= 1600) return 'user-blue';
    if (rating >= 1200) return 'user-cyan';
    if (rating >=  800) return 'user-green';
    if (rating >=  400) return 'user-brown';
    if (rating >=    0) return 'user-gray';
    return 'user-unrated';
}

function getAchRate(rating) {
    const base = Math.floor(rating / 400) * 400;
    return ((rating - base) / 400) * 100;
}

function colorize(u, rating) {
    /* */if (rating >= 4000) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown4000.gif">&nbsp;');
    else if (rating >= 3600) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown3600.gif">&nbsp;');
    else if (rating >= 3200) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown3200.gif">&nbsp;');
    else {
        const color = getColor(rating);
        const achRate = getAchRate(rating);
        $(u).before(`
            <span style="
                display: inline-block;
                height: 12px;
                width: 12px;
                vertical-align: center;
                border-radius: 50%;
                border: solid 1px ${color};
                background: -webkit-linear-gradient(
                    bottom,
                    ${color} 0%,
                    ${color} ${achRate}%,
                    rgba(255, 255, 255, 0.0) ${achRate}%,
                    rgba(255, 255, 255, 0.0) 100%);
            "></span>
        `);
    }
    $(u).addClass(getColorClass(rating));
}

$(function() {
    'use strict';

    lscache.flushExpired();

    $('a[href*="/users"]').each(function(_, u) {
        // Skip "My Profile"
        if ($(u).find('span').length) return true;

        const userName = $(this).attr('href').slice(7);
        const lskey = "rating-" + userName;
        let rating = lscache.get(lskey);

        if (rating === null) {
            $.ajax({
                url: "https://atcoder.jp" + $(this).attr('href') + "/history/json",
                type: 'GET',
                dataType: 'json'
            })
            .done(function(data) {
                const ratedCount = data.length;
                if (ratedCount == 0) {
                    rating = 0;
                } else {
                    rating = data[ratedCount - 1]["NewRating"];
                }
                // Update every 3 hours
                lscache.set(lskey, rating, 3 * 60);
            })
            .then(function() {
                colorize(u, rating);
            });
        } else {
            colorize(u, rating);
        }
    });
});
