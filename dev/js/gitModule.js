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
            $('.markdown').append(newText);
        });
        link = dataObj.items[randRepo].html_url;
        $('#solve').attr('href', dataObj.items[randRepo].html_url);
        if(dataObj.items[randRepo].pull_request) {
            $('.suggestionApp-action').trigger('click');
        }
        $('code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
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