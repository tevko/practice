var ACTION_SELECTOR = '.suggestionApp-action';
var CONTENT_WRAPPER_SELECTOR = '.suggestionApp-content';
var FORM_SELECTOR = '.suggestionApp-prompts form';
var NOTICE_SELECTOR = '.items-notice';
var HIDDEN_INPUT_SELECTOR = '.hiddenInput';

var utils = (function () {
    'use strict';

    var random_number = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var display_message = function (message) {
        var show_class = 'items-notice_show';

        $(NOTICE_SELECTOR).html(message);
        $(NOTICE_SELECTOR).removeClass(show_class);
        $(NOTICE_SELECTOR).addClass(show_class);
        setTimeout(function () {
            $(NOTICE_SELECTOR).removeClass(show_class);
        }, 4000);
    };

    var get_value = function (parent, child) {
        return ((parent && parent[child]) || '');
    };

    var get_json = function (url, params) {
        return JSON.parse(
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                global: false,
                async: false,
                data: params,
                success: function (data) {
                    return data;
                }
            }).responseText
        );
    };

    return {
        random_number: random_number,
        display_message: display_message,
        get_json: get_json,
        get_value: get_value
    };
}());

var random = (function () {
    'use strict';

    var data = {};
    var counter = 0;
    var $notice = $(NOTICE_SELECTOR);
    var total = $notice.data('total');
    var message = $notice.data('message') || '';
    message = message.replace(/\#\{total\}/g, total);
    var LEVEL_SELECTOR = '.suggestionApp-level';
    var LEVELS = {
        'Advanced': 'rgb(138, 44, 44)',
        'Intermediate': 'rgb(170, 170, 28)',
        'Easy': 'rgb(31, 145, 36)'
    };

    var get_data = function () {
        var jsonUrl = 'random.json';
        data = utils.get_json(jsonUrl, {});
    };

    var render_item = function () {
        var item = data[counter];
        var $text = $('<p>', {
            text: item.value
        });
        $(CONTENT_WRAPPER_SELECTOR).html($text);
        $(LEVEL_SELECTOR).text(item.Difficulty);

        if (counter === (total - 1)) {
            utils.display_message(message);
        }
        $.each(LEVELS, function (level, color) {
            if (level === $(LEVEL_SELECTOR).text()) {
                $(LEVEL_SELECTOR).css('background-color', color);
            }
        });

        $(HIDDEN_INPUT_SELECTOR).attr('value', '{
            "title": "New Pen from The Practice App!",
            "html": "<!-- ' + item.value + ' -->"
        }');
        var progress_percentage = ((100 / total) * counter) + '%';
        $('.progress').css('width', progress_percentage);
    };

    var setup_bindings = function () {
        $(ACTION_SELECTOR).on('click', function () {
            counter = (counter + 1) % total;
            render_item();
        });
        Mousetrap.bind('right', function () {
            $(ACTION_SELECTOR).trigger('click');
        });
        Mousetrap.bind('enter', function () {
            $(FORM_SELECTOR).trigger('submit');
        });
    };

    var init = function () {
        get_data();
        render_item();
        setup_bindings();
    };

    return {
        init: init
    };
}());

var dribbble = (function () {
    'use strict';

    var data = {};
    var counter = 0;
    var total = 11;

    var get_data = function () {
        var jsonUrl = 'https://api.dribbble.com/v1/shots/';
        var randomPage = utils.random_number(1, 29);
        data = utils.get_json(jsonUrl, {
            page: randomPage,
            access_token: '6288d1baba6d36c25f2b62037e644f450d6e8d2b8c68d064bae2adeed090d6d3'
        });
    };

    var render_shot = function () {
        if (counter > (total - 1) || (counter === 0)) {
            get_data();
        }
        $(CONTENT_WRAPPER_SELECTOR).empty();
        var shot = data[counter];

        var $image = $('<img>', {
            src: shot.images.normal
        });
        var $br = $('<br>');
        var $link = $('<a>', {
            href: shot.html_url,
            text: shot.user.name,
            target: '_blank'
        });
        var $name = $('<h3>', {
            text: shot.title + ' by '
        });
        $name.append($link);

        $(CONTENT_WRAPPER_SELECTOR).append($image, $br, $name);

        $(HIDDEN_INPUT_SELECTOR).attr('value', '{
            "title": "New Pen from The Practice App!",
            "html": "<img src=\'' + shot.images.normal + '\'/>"
        }');
    };

    var setup_bindings = function () {
        $(ACTION_SELECTOR).on('click', function () {
            counter = (counter + 1) % total;
            render_shot();
        });

        Mousetrap.bind('right', function () {
            counter = (counter + 1) % total;
            render_shot();
        });

        Mousetrap.bind('enter', function () {
            $(FORM_SELECTOR).trigger('submit');
        });
    };

    var init = function () {
        render_shot();
        setup_bindings();
    };

    return {
        init: init
    };
}());


var github = (function () {
    'use strict';

    var data = {};
    var LANGUAGE_SELECTOR = '#language-select';
    var CONTENT_HOLDER_SELECTOR = '.content-holder';
    var counter = 0;
    var total = $(NOTICE_SELECTOR).data('total');
    var randomPage = utils.random_number(counter, total);
    var message = $(NOTICE_SELECTOR).data('message');

    var get_data = function () {
        var language = $(LANGUAGE_SELECTOR).val();
        var jsonUrl = 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(language) + '+state:open&page=' + randomPage;
        data = utils.get_json(jsonUrl, {});
    };

    var render_issue = function () {
        if ((counter > (total - 1)) || (counter === 0)) {
            get_data();
        }
        var randomItem = utils.random_number(0, total);
        var issue = data.items[randomItem];
        var $title = $('<h3>', {
            text: utils.get_value(issue, 'title')
        });
        var $body = $(marked(utils.get_value(issue, 'body')));
        var $timestamp = $('<p>', {
            text: utils.get_value(issue, 'created_at')
        });

        $(CONTENT_WRAPPER_SELECTOR)
            .html($body)
            .prepend($title)
            .append($timestamp);

        if (utils.get_value(issue, 'pull_request') !== '') {
            var $pull_request = $('<p>', {
                html: marked('Current pull request: ' + issue.pull_request.html_url)
            });
            $(CONTENT_WRAPPER_SELECTOR).append($pull_request);
        }
        $('#solve').attr('href', utils.get_value(issue, 'html_url'));

        $(CONTENT_HOLDER_SELECTOR)
            .scrollTop(0)
            .perfectScrollbar('update');

        $(CONTENT_WRAPPER_SELECTOR).find('code').each(function (i, el) {
            hljs.highlightBlock(el);
        });
    };

    var setup_bindings = function () {
        $(LANGUAGE_SELECTOR).on('change', function () {
            get_data();
            render_issue();
        });

        $(ACTION_SELECTOR).on('click', function () {
            counter = (counter + 1) % total;
            render_issue();
        });

        Mousetrap.bind('right', function () {
            $(ACTION_SELECTOR).trigger('click');
        });

        Mousetrap.bind('enter', function () {
            $('#solve').trigger('click');
        });
    };

    var init = function () {
        utils.display_message(message);
        render_issue();
        setup_bindings();
    };

    return {
        init: init
    };
}());

var core = (function () {
    'use strict';

    var init = function () {
        $(ACTION_SELECTOR).on('click', function (event) {
            event.preventDefault();
        });

        switch ($('article').attr('class')) {
        case 'block-random':
            random.init();
            break;
        case 'block-dribbble':
            dribbble.init();
            break;
        case 'block-github':
            github.init();
            break;
        }
    };

    return {
        init: init
    };
}());

core.init();
