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