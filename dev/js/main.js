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
            $.getJSON( "http://api.dribbble.com/shots/everyone/?callback=?", { page: randomPageNumber }).done(function(page) {
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