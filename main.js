// ==UserScript==
// @name         AtCoder Submission User Colorizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提出一覧のユーザ名を色付けします
// @author       morio_prog
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @license      CC0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.0/jquery.min.js
// ==/UserScript==

function getcolor(rating) {
    if (rating >= 2800) return '#FF0000';
    if (rating >= 2400) return '#FF8000';
    if (rating >= 2000) return '#C0C000';
    if (rating >= 1600) return '#0000FF';
    if (rating >= 1200) return '#00C0C0';
    if (rating >= 800)  return '#008000';
    if (rating >= 400)  return '#804000';
    if (rating >= 0)    return '#808080';
    return '#000000';
}

function getcolorclass(rating) {
    if (rating >= 2800) return 'user-red';
    if (rating >= 2400) return 'user-orange';
    if (rating >= 2000) return 'user-yellow';
    if (rating >= 1600) return 'user-blue';
    if (rating >= 1200) return 'user-cyan';
    if (rating >= 800)  return 'user-green';
    if (rating >= 400)  return 'user-brown';
    if (rating >= 0)    return 'user-gray';
    return 'user-unrated';
}

function getachrate(rating) {
    var base = Math.floor(rating / 400) * 400;
    return ((rating - base) / 400) * 100;
}

$(function() {
    'use strict';

    const baseurl = "https://atcoder.jp";

    $('a[href*="/users"]').each(function(i, u) {
        // 右上のマイプロフィールを省く
        if ($(u).find('span').length) return true;

        var uri = baseurl + $(this).attr('href');
        $.ajax({
            url: uri,
            type: 'GET',
            dataType: 'html'
        })
        .done(function(data) {
            var parseHtml = $.parseHTML(data);
            var $userpage = $(parseHtml);

            var rating = parseInt($userpage.find('#main-container > div.row > div.col-sm-9 > table > tbody > tr:nth-child(2) > td > span').text(), 10);
            if (isNaN(rating)) return true;

            /* */if (rating >= 4000) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown4000.gif">&nbsp;');
            else if (rating >= 3600) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown3600.gif">&nbsp;');
            else if (rating >= 3200) $(u).before('<img style="vertical-align: middle;" src="//img.atcoder.jp/assets/icon/crown3200.gif">&nbsp;');
            else {
                var color = getcolor(rating);
                var achrate = getachrate(rating);
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
                            ${color} ${achrate}%,
                            rgba(255, 255, 255, 0.0) ${achrate}%,
                            rgba(255, 255, 255, 0.0) 100%);
                    "></span>
                `);
            }
            $(u).addClass(getcolorclass(rating));
        });
    });
});
