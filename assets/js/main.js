if ($('.block-github').length) {

    //variables

    var randPage = Math.floor(Math.random() * 34),
        getRandPage = function() {
            randPage = Math.floor(Math.random() * 34);
        },
        randRepo = 0,
        build = 30,
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
            dataObj = getJson("https://api.github.com/search/issues?q=state%3Aopen&page=" + randPage);
        }
        $('.suggestionApp-content').empty();
        $('.suggestionApp-content').append(compile(dataObj)).promise().done(function() {
            var converter = new Markdown.Converter(),
            text = $('.markdown').contents().filter(function() {
                return this.nodeType == 3;
            }).text(),
            newText = converter.makeHtml(text);
            $('.markdown').empty();
            $('.markdown').append(newText);
        });
        $('#solve').attr('href', dataObj.items[randRepo].html_url);

        if(dataObj.items[randRepo].pull_request) {
            $('.suggestionApp-action').trigger('click');
            console.log('we\'re skipping pull requests');
        }
    }
    solveGit();
    $('.suggestionApp-action').click(function() {
        solveGit();
    });
}
(function($ , window , undefined) {
    //global stuff
    $('.suggestionApp-action').click(function(event) {
        event.preventDefault();
    });
    //random module
    if ($('.block-random').length) {
        $.getJSON('random.json').done(function(data) {
            counter = 0;
            $('span').text(data[0].value);
            $('.suggestionApp-action').click(function() {
                var build = 20;
                counter = (counter + 1) % build;
                $('span').text(data[counter].value);
                if(counter == 19) {
                    alert('That\'s 20 items! Come back next week for 20 more!');
                }
            });
        });
    }
    //dribble module
    if ($('.block-dribbble').length) {
        function getDribbleShot() {
            var randomPageNumber = Math.floor(Math.random() * (29 - 1 + 1)) + 1;
            $.getJSON( "https://api.dribbble.com/shots/everyone/?callback=?", { page: randomPageNumber }).done(function(page) {
                var dribbleImg = $(page.shots);
                var randomNumber = Math.floor(Math.random() * (14 - 1 + 1)) + 1;
                var image = '<img src="' + dribbleImg[randomNumber].image_url + '"/>';
                $('.suggestionApp-content')
                    .append('<br>' + image + '<br>')
                    .append( dribbleImg[randomNumber].player.name + '<br>')
                    .append('<a href="' + dribbleImg[randomNumber].player.url + '">' + dribbleImg[randomNumber].player.url +'</a>'
                );
            });
        }
        getDribbleShot();
        $('.suggestionApp-action').click(function() {
            $('.suggestionApp-content').empty();
            getDribbleShot();
        });
    }
})(jQuery , window );