/**
 * autoCompltr 1.1.3
 * Apache 2.0 Licensing
 * Copyright (c) 2014 Jérémie Boulay <jeremi.boulay@gmail.com>
 * URL : https://github.com/Jeremboo/autoCompltr
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Creative Commons Licence.
 *
 */


 /* ##########
   INIT 
   ########## */

function AutoCompltr(wrapper, datas) {
    'use strict';

    this.CLASSNAME_AUTO_COMPLTR = "AutoCompltr";
    this.CLASSNAME_AUTO_COMPLTR_SUGGESTION_LIST = "AutoCompltr-suggestionList";
    this.CLASSNAME_AUTO_COMPLTR_SUGGESTION = "AutoCompltr-suggestion";
    this.CLASSNAME_AUTO_COMPLTR_INPUT = "AutoCompltr-input";

    this.HTMLWrapper = wrapper;
    this.suggestionsList = [];
    this.suggestionsFind = [];
    this.pointer = -1;
    this.focused = null;
    this.HTMLSuggestionsList = document.createElement('ul');
    this.HTMLInput = document.createElement('input');

    this.onEnterEvent = null;

    if (datas) {
        this.setSuggestionsList(datas);
    }

    this.init();
}

AutoCompltr.prototype.init = function () {
    'use strict';

    this.HTMLWrapper.classList.add(this.CLASSNAME_AUTO_COMPLTR);
    this.HTMLSuggestionsList.className = this.CLASSNAME_AUTO_COMPLTR_SUGGESTION_LIST;
    this.HTMLInput.className = this.CLASSNAME_AUTO_COMPLTR_INPUT;
    this.HTMLInput.type = "text";
    this.HTMLWrapper.appendChild(this.HTMLInput);
    this.HTMLWrapper.appendChild(this.HTMLSuggestionsList);

    var that = this;

    this.keyboardEvent();
    document.body.addEventListener('click', function () {
        that.hideSuggestionsList();
    });
};

AutoCompltr.prototype.keyboardEvent = function () {
    'use strict';

    var that = this;

    this.HTMLInput.addEventListener('keyup', function (e) {
        e = e || window.event;

        var keycode = e.keyCode;

        if (keycode === 38 || keycode === 40) {
            that.navigation(keycode);
        } else if (keycode === 13) {
            if (that.focused) {
                that.setInputByFocus();
            }
            if (that.onEnterEvent) {
                that.onEnterEvent(e);
            }
        } else {
            if (that.HTMLInput.value !== "") {
                that.displaySuggestions(false);
            } else {
                that.displaySuggestions(true);
            }
        }
    });
};


/* ##########
   FIND SUGGESTIONS 
   ########## */

AutoCompltr.prototype.displaySuggestions = function (showAll) {
    'use strict';

    this.HTMLSuggestionsList.style.display = 'block';
    this.pointer = -1;

    var suggs = "",
        i = 0,
        inputText = this.HTMLInput.value.toLowerCase();

    for (i = 0; i < this.suggestionsList.length; i += 1) {
        if (this.suggestionsList[i].toLowerCase().indexOf(inputText) >= 0 || showAll === true) {
            if (this.suggestionsList[i].toLowerCase().indexOf(inputText) === 0) {
                suggs = this.insertSuggestion(i) + suggs;
            } else {
                suggs += this.insertSuggestion(i);
            }
        }
    }

    this.HTMLSuggestionsList.innerHTML = suggs;
    this.clickableSuggestion();
};

AutoCompltr.prototype.insertSuggestion = function (i) {
    'use strict';

    return '<li id="' + i + '" class="' + this.CLASSNAME_AUTO_COMPLTR_SUGGESTION + '">' +
        this.suggestionsList[i] + '</li>';
};


/* ##########
   SELECT SUGGESTIONS 
   ########## */

AutoCompltr.prototype.clickableSuggestion = function () {
    'use strict';

    this.suggestionsFind = document.getElementsByClassName(this.CLASSNAME_AUTO_COMPLTR_SUGGESTION);

    var numberOfSuggestions = this.suggestionsFind.length,
        i = 0;

    if (numberOfSuggestions) {
        for (i; i < numberOfSuggestions; i += 1) {
            this.onClickAtSuggestion(this.suggestionsFind[i]);
        }
    }
};

AutoCompltr.prototype.onClickAtSuggestion = function (suggestion) {
    'use strict';

    var that = this;

    suggestion.addEventListener('click', function (e) {
        that.HTMLInput.value = e.srcElement.innerHTML;
    });
};

AutoCompltr.prototype.navigation = function (keycode) {
    'use strict';

    if (this.pointer >= -1 && this.pointer <= this.suggestionsFind.length - 1) {
        if (this.pointer === -1) {
            if (keycode === 40) {
                this.chooseFocus(keycode);
            }
        } else if (this.pointer === this.suggestionsFind.length - 1) {
            if (keycode === 38) {
                this.chooseFocus(keycode);
            }
        } else {
            this.chooseFocus(keycode);
        }
    }
};

AutoCompltr.prototype.chooseFocus = function (keycode) {
    'use strict';

    if (keycode === 40) {
        if (this.pointer !== -1) {
            this.removeFocus();
        }
        this.pointer += 1;
        this.setFocus();
    } else if (keycode === 38) {
        this.removeFocus();
        this.pointer -= 1;
        if (this.pointer !== -1) {
            this.setFocus();
        }
    }
};

AutoCompltr.prototype.setFocus = function () {
    'use strict';

    this.focused = this.suggestionsFind[this.pointer].innerHTML;
    this.suggestionsFind[this.pointer].className += ' focus';
};

AutoCompltr.prototype.removeFocus = function () {
    'use strict';

    this.focused = null;
    this.suggestionsFind[this.pointer].className += this.CLASSNAME_AUTO_COMPLTR_SUGGESTION;
};

AutoCompltr.prototype.setInputByFocus = function () {
    'use strict';

    this.HTMLInput.value = this.focused;
    this.removeFocus();
    this.pointer = -1;
    this.hideSuggestionsList();
};

/* ##########
   OTHER
   ########## */

AutoCompltr.prototype.setSuggestionsList = function (datas) {
    'use strict';

    if (typeof datas === 'object') {
        this.suggestionsList = datas;
    } else {
        console.error("Your list is not a good array or is empty.");
    }
};

AutoCompltr.prototype.hideSuggestionsList = function () {
    'use strict';

    this.HTMLSuggestionsList.style.display = 'none';
};

AutoCompltr.prototype.getValue = function () {
    'use strict';

    return this.HTMLInput.value;
};

AutoCompltr.prototype.placeholder = function (placeholder) {
    'use strict';

    this.HTMLInput.placeholder = placeholder;
};

/* ##########
   ADDITIONNAL ACTION FOR EVENT
   ########## */

AutoCompltr.prototype.onEnter = function (callback, once) {
    'use strict';

    once = once || false;
    this.onEnterEvent = function (e) {

        this.hideSuggestionsList();
        callback(e);
        if (once) {
            this.removeOnEnter();
        }
    };
};

AutoCompltr.prototype.removeOnEnter = function () {
    'use strict';

    this.onEnterEvent = null;
};