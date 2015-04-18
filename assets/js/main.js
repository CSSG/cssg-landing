'use strict';

var klass = {
    sticky : '__sticky',
    stickyWrapper: 'sticky-wrapper',
    hidden: '__hidden'
};

var path = window.location.pathname;

$(function(){

    var menu = $('.js-menu');
    if(menu.length){

        var header = $('header').eq(0);
        var main = $('main.content');

        // get menu boundaries
        var mainOffsetTop = main.children().first().offset().top - header.outerHeight();
        var mainOffsetBot = document.body.offsetHeight - main.outerHeight() - mainOffsetTop;

        var menuOffset = function(){
            return Math.abs( parseInt(menu.css('margin-left')) );
        };

        var menuWidth = function(){
            return menu.parent().width() + menuOffset();
        };

        //
        // sticky menu
        menu.sticky({
            getWidthFrom : menu.parent(),
            topSpacing : mainOffsetTop,
            bottomSpacing : mainOffsetBot
        });

        menu.on('sticky-start', function() {
            menu.css({width : menuWidth()});
            menu.addClass(klass.sticky);
        });

        menu.on('sticky-end', function(){
            menu.removeClass(klass.sticky);
        });

        // recalc width on resize
        $(window).on('resize', debounce(function(){
            menu.css({width : menuWidth()});
        }, 32));

        // initial load
        menu
            .fadeOut(0, function(){
                menu.removeClass(klass.hidden);
                menu.fadeIn(500);
            });

        //
        // build submenu
        var headers = $('h2').map(function(i,item){
            return {
                id: $(item).attr('id'),
                title: $(item).text()
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
            }
        });
        var menuList = buildMenu(headers);

        // get target wrapper
        var menuLink = menu.find('a').filter(function(i, item){
            return $(item).attr('href') == path;
        });
        var menuMenu = menuLink.next();

        // append menu items
        $(menuList).appendTo(menuMenu);
    }

});

//
// debounce
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

//
// build menu
function buildMenu(ids){
    var menu = "";
    var tpl = '' +
        '<li>' +
            '<a href="#{id}" title="">' +
                '{title}' +
            '</a>' +
        '</li>';

    for(var i = 0; i < ids.length; i++){
        menu += tpl
            .replace('{id}', ids[i].id)
            .replace('{title}', ids[i].title);
    }

    return menu;
};