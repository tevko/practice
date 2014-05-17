(function($, window, undefined) {
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
                if (counter == 19) {
                    alert('That\'s 20 items! Come back next week for 20 more!');
                }
            });
        });
    }
    //github module
    if ($('.block-github').length) {
        function getGitRepo() {
            var randomPageNumber = Math.floor(Math.random() * (10000000 - 1 + 1)) + 1;
            $.getJSON("https://api.github.com/repositories?since=" + randomPageNumber).done(function(data) {
                var randomNumber = Math.floor(Math.random() * (99 - 1 + 1)) + 1;
                $('.suggestionApp-content')
                    .append('<br>' + data[randomNumber].name + '<br>')
                    .append(data[randomNumber].description + '<br>')
                    .append('<a href="' + data[randomNumber].html_url + '" target="_blank">' + data[randomNumber].html_url + '</a>');
            });
        }
        getGitRepo();
        $('.suggestionApp-action').click(function() {
            $('.suggestionApp-content').empty();
            getGitRepo();
        });
    }
    //dribble module

    // Getting only shots of web design is tricky because you can't query the API

    if ($('.block-dribbble').length) {

        var foundShots = false;

        function getDribbleShot() {
            var randomPageNumber = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
            var url = "https://api.dribbble.com/shots/everyone/?callback=?&page=" + randomPageNumber;   //get a random page of shots
            console.log(url);
            $.ajax({
                url: url,
                dataType: 'jsonp'
            }).success(function(data) {
                $.each(data.shots, function() {
                    var title = this.title.toLowerCase(); // use the title of each shot to figure out if it's web-related
                    var webElements = ['website', 'webpage', 'web page', 'tablet', 'phone', 'ios', 'ipad', 'iphone', 'android', 'homepage', 'home page', 'login', ' web ', ' ui ', 'mobile', ' form '], // keywords that would show up in a web design's title.
                        length = webElements.length;
                    while (length--) {
                        if ((title.indexOf(webElements[length]) != -1) && (foundShots == false)) { // If the title contains any of the keywords, grab the shot
                            var image = '<img src="' + this.image_url + '"/>';
                            $('.suggestionApp-content')
                                .append('<br>' + image + '<br>')
                                .append(this.player.name + '<br>')
                               .append('<a href="' + this.player.url + '">' + this.player.url + '</a>');
                            foundShots = true; // we found a shot! tell the rest of the script the good news
                        }
                    }
                });
                if (foundShots == true) {
                    return; // stop the function if we found a shot already
                } else {
                    getDribbleShot(); // if we didn't find a shot, go get another page of results and repeat the process until we find one (or dribble rate-limits us)
                }
            });
        }

        getDribbleShot();

        $('.suggestionApp-action').click(function() {
            $('.suggestionApp-content').empty();
            foundShots = false;
            getDribbleShot();

        });
    }
})(jQuery, window);
