if ($('.block-github').length) {
    setTimeout(function() {
        $('.items-notice').removeClass('items-notice_show-github');
    }, 2000);
    //variables

    var randPage = Math.floor(Math.random() * 34),
        getRandPage = function() {
            randPage = Math.floor(Math.random() * 34);
        },
        randRepo = 0,
        build = 30,
        language = '',
        dataObj = getJson("https://api.github.com/search/issues?q=state%3Aopen&page=" + randPage),
        template = $('.template').html(),
        compile = _.template(template);


    //functions

    function getJson(url) {
        return JSON.parse($.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            global: false,
            async:false,
            success: function(data) {
                return data;
            },
            fail: function() {
                alert('Woops, something went wrong! Please file an issue on Github!')
            }
        }).responseText);
    }


    function solveGit() {
        //get a random set of
        randRepo = (randRepo + 1) % build;
        // if we've clicked the button 30 times, get a new set of results from github
        if (randRepo == 29) {
            getRandPage();
            dataObj = getJson("https://api.github.com/search/issues?q=state%3Aopen" + language + "&page=" + randPage);
        }
        $('.suggestionApp-content').empty();
        $('.suggestionApp-content').append(compile(dataObj)).promise().done(function() {
            var converter = Markdown.getSanitizingConverter(),
            text = $('.markdown').contents().filter(function() {
                return this.nodeType == 3;
            }).text(),
            newText = converter.makeHtml(text);
            $('.markdown').empty();
            console.log(newText);
            $('.markdown').append(newText);
        });
        link = dataObj.items[randRepo].html_url;
        $('#solve').attr('href', dataObj.items[randRepo].html_url);
        if(dataObj.items[randRepo].pull_request) {
            $('.suggestionApp-action').trigger('click');
            console.log('we\'re skipping pull requests');
        }
    }
    solveGit();
    //keyboard shortcut
    Mousetrap.bind('right', function() {
        solveGit();
        $('.content-holder').scrollTop(0);
        $('.content-holder').perfectScrollbar('update');
    });
    Mousetrap.bind('enter', function() {
        window.open(link, '_blank');
        console.log('enter');
    });
    //clicking the button
    $('.suggestionApp-action').click(function() {
        solveGit();
        $('.content-holder').scrollTop(0);
        $('.content-holder').perfectScrollbar('update');
    });

    $('#language-select').change(function(){
        randRepo = 28;
        if ($('#language-select').val()) {
            language = '&language:'+$('#language-select').val();
        } else {
            language = '';
        }
        solveGit();
        $('.content-holder').scrollTop(0);
        $('.content-holder').perfectScrollbar('update');
    });
}
(function($ , window , undefined) {
    //global stuff
    $('.suggestionApp-action').click(function(event) {
        event.preventDefault();
    });
    //random module
    if ($('.block-random').length) {
        counter = 0;
        var build = 20;
        function itemsNotice() {
            $('.items-notice').removeClass('items-notice_show');
            $('.items-notice').addClass('items-notice_show');
            setTimeout(function() {
                $('.items-notice').removeClass('items-notice_show');
            }, 2000);
        }
        function getRandom() {
            $.getJSON('random.json').done(function(data) {
                var progressWidth = counter * 5.2631579;
                $('.progress').css('width', progressWidth + '%');
                $('span').text(data[counter].value);
                $('.suggestionApp-level').text(data[counter].Difficulty);
                $('.hiddenInput')[0].value = '{
                                                "title": "New Pen from The Practice App!",
                                                "html": "<h1>' + data[counter].value + '</h1>",
                                                "css": "span{ position: absolute;top: 1px;right: 1px;}"
                                            }';
                if(counter == 19) {
                    itemsNotice();
                }
                if ($('.suggestionApp-level').text() == 'Advanced') {
                    $('.suggestionApp-level').css('background-color', 'rgb(138, 44, 44)');
                } else if($('.suggestionApp-level').text() == 'Intermediate') {
                    $('.suggestionApp-level').css('background-color', 'rgb(170, 170, 28)');
                } else if($('.suggestionApp-level').text() == 'Easy') {
                    $('.suggestionApp-level').css('background-color', 'rgb(31, 145, 36)');
                }
            });
        }
        getRandom();
        //keyboard shortcut
        Mousetrap.bind('right', function() {
            $('.suggestionApp-action').trigger('click');
        });
        Mousetrap.bind('enter', function() {
            $('#solveItem').trigger('click');
        });
        $('.suggestionApp-action').click(function() {
            counter = (counter + 1) % build;
            getRandom();
        });

    }
    //dribble module
    if ($('.block-dribbble').length) {
        function getDribbleShot() {
            var randomPageNumber = Math.floor(Math.random() * (29 - 1 + 1)) + 1;
            $.getJSON( "http://api.dribbble.com/shots/everyone/?callback=?", { page: randomPageNumber }).done(function(page) {
                var dribbleImg = $(page.shots);
                var randomNumber = Math.floor(Math.random() * (14 - 1 + 1)) + 1;
                var image = '<img src="' + dribbleImg[randomNumber].image_url + '"/>';
                $('.suggestionApp-content')
                    .append('<br>' + image + '<br>')
                    .append( dribbleImg[randomNumber].player.name + '<br>')
                    .append('<a href="' + dribbleImg[randomNumber].player.url + '">' + dribbleImg[randomNumber].player.url +'</a>'
                );
                $('.hiddenInput')[0].value = '{
                                                "title": "New Pen from The Practice App!",
                                                "html": "<img src=\'' + dribbleImg[randomNumber].image_url + '\'/>"
                                            }';
            });
        }
        getDribbleShot();
        $('.suggestionApp-action').click(function() {
            $('.suggestionApp-content').empty();
            getDribbleShot();
        });
        Mousetrap.bind('right', function() {
            $('.suggestionApp-content').empty();
            getDribbleShot();
        });
        Mousetrap.bind('enter', function() {
            $('.dribbbleSubmit').trigger('click');
        });
    }
})(jQuery , window );