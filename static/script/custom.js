/*
  _____                   _                _     _                                                                      
 |  __ \                 | |              | |   | |                                                                     
 | |__) |   ___    _ __  | |_    ___    __| |   | |__    _   _                                                          
 |  ___/   / _ \  | '__| | __|  / _ \  / _` |   | '_ \  | | | |                                                         
 | |      | (_) | | |    | |_  |  __/ | (_| |   | |_) | | |_| |                                                         
 |_|       \___/  |_|     \__|  \___|  \__,_|   |_.__/   \__, |                                                         
                                                          __/ |                                                         
                                                         |___/                                                          
                                _     _                     _       _   _          _                               _    
     /\                        | |   | |                   | |     | \ | |        | |                             | |   
    /  \     _ __ ___     ___  | |_  | |__    _   _   ___  | |_    |  \| |   ___  | |_  __      __   ___    _ __  | | __
   / /\ \   | '_ ` _ \   / _ \ | __| | '_ \  | | | | / __| | __|   | . ` |  / _ \ | __| \ \ /\ / /  / _ \  | '__| | |/ /
  / ____ \  | | | | | | |  __/ | |_  | | | | | |_| | \__ \ | |_    | |\  | |  __/ | |_   \ V  V /  | (_) | | |    |   < 
 /_/    \_\ |_| |_| |_|  \___|  \__| |_| |_|  \__, | |___/  \__|   |_| \_|  \___|  \__|   \_/\_/    \___/  |_|    |_|\_\
                                               __/ |                                                                    
                                              |___/                                                                     
*/
const tips = [
    'did you know that blur made this.</a>',
    'i think discord works.</a>',
    'hey check this one out!.</a>',
    'where is the search bar.',
    'how to use discord pls help</a>'
];



function access(app) {
    if (document.querySelector('header').hasAttribute('data-init')) {
        document.querySelector('header').removeAttribute('data-init')
    };

    app.search.back.style.display = 'none';
    app.search.logo.style.display = 'inline';
    app.search.logo.style.marginLeft = '0';
    app.search.submit.style.display = 'inline';
    app.search.input.style.removeProperty('display');
    app.search.input.placeholder = '"fr?"';
    app.header.target.setAttribute('data-page', '');
    app.nav.target.style.removeProperty('display');
    document.querySelector('#open-nav').setAttribute('data-open', '');
    app.search.input.focus();


    
    app.nav.community = app.createLink('#community', 'talk to people');
    app.nav.support = app.createLink('#support', 'help i guess');
    app.nav.apps = app.createLink('#apps', 'apps i guess');
    app.nav.games = app.createLink('#gs', 'funny games');
    app.nav.settings = app.createLink('#settings', '<i class="fas fa-sliders-h secondary"></i>', {
        id: 'apps'
    })

	app.main.tip = app.createElement('div', tips[Math.floor(Math.random()*tips.length)], {
        class: 'tip'
    });


    app.main.suggestions = app.createElement('div', [], {
        class: 'suggestions',
        style: {
            display: 'block'
        } 
    });

    app.search.input.setAttribute(
        'oninput',
        '(' + (async function() {
            app.main.suggestions.innerHTML = '';
            if (!event.target.value) {
                app.nav.target.style.removeProperty('display');
                app.header.target.setAttribute('data-page', '');
		app.main.tip.style.removeProperty('display');
                app.search.logo.style.display = 'inline';
                return;
            }
	    app.main.tip.style.display = 'none';
            app.header.target.removeAttribute('data-page');
            app.nav.target.style.display = 'none';
            app.search.logo.style.display = 'none';

            clearTimeout(app.timeout);
            app.timeout = setTimeout(async () => {
                const res = await fetch(__uv$config.bare + 'v1/', {
                    headers: {
                        'x-bare-host': 'duckduckgo.com',
                        'x-bare-protocol': 'https:',
                        'x-bare-path': '/ac/?q=' + encodeURIComponent(event.target.value),
                        'x-bare-port': '443',
                        'x-bare-headers': JSON.stringify({ Host: 'duckduckgo.com' }),
                        'x-bare-forward-headers': '[]'
                    }
                })
                const json = await res.json();

                for (const suggestion of json) {
                    app.main.suggestions.append(
                        app.createElement('div', suggestion.phrase, {
                            class: 'suggestion',
                            events: {
                                click() {
                                    app.search.input.value = suggestion.phrase;
                                    const frame = document.querySelector('iframe');
                                    document.querySelector('main').style.display = 'none';
                                    document.querySelector('header').style.display = 'none';
                                    frame.style.display = 'block';
                                    frame.src = './load.html#' + encodeURIComponent(btoa(suggestion.phrase));
                                    document.querySelector('.access-panel').style.removeProperty('display');
                                }
                            }
                        })
                    )
                };
            }, 400);

        }).toString() + ')()'
    );
    app.search.input.setAttribute('form', 'access-form');
    app.search.submit.setAttribute('form', 'access-form');

    const params = new URLSearchParams(window.location.search);

    if (params.has('link')) {
        app.main.target.style.display = 'none';
        app.header.target.style.display = 'none';
        
        const frame = document.querySelector('.access-frame');

        frame.src = '/load.html#' + encodeURIComponent(params.get('link'));
        frame.style.display = 'block';

        document.querySelector('.access-panel').style.removeProperty('display');
        history.replaceState('', '', window.location.pathname + '#');
    };
};

export { access };
