/**
 * autoCompltr 1.0.0
 * GNU Licensing
 * Copyright (c) 2014 Jérémie Boulay <jeremi.boulay@gmail.com>
 * URL : https://github.com/Jeremboo/AutoCompltr
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Creative Commons Licence.
 *
 */


 /* ##########
   INIT 
   ########## */

function AutoCompltr(wrapper, datas){

    this.HTMLWrapper = wrapper;
    this.suggestionsList = [];
    this.suggestionsFind = [];
    this.pointer = -1;
    this.focused = null;
    this.HTMLSuggestionsList = document.createElement('ul');
    this.HTMLInput = document.createElement('input');

    if(datas)
        this.setSuggestionsList(datas);
    this.init();
}

AutoCompltr.prototype.init = function(){

    this.HTMLWrapper.className += " AutoCompltr";
    this.HTMLSuggestionsList.className = "AutoCompltr-suggestionList";
    this.HTMLInput.type = "text";
    this.HTMLInput.className = "AutoCompltr-input";
    this.HTMLWrapper.appendChild(this.HTMLInput);
    this.HTMLWrapper.appendChild(this.HTMLSuggestionsList);

    var that = this;

    this.keyboardEvent();
    document.body.addEventListener('click',function(){
        that.hideSuggestionsList();
    });
};

AutoCompltr.prototype.keyboardEvent = function(){

    var that = this;

    this.HTMLInput.addEventListener('keyup',function(e){

        e = e || window.event;
        
        var keycode = e.keyCode;

        if(keycode === 38 || keycode === 40){
            that.navigation(keycode);
        } else if (keycode === 13) {
            if(that.focused)
                that.setInputByFocus();
        } else {
            if(that.HTMLInput.value !== "") {
                that.displaySuggestions(false);
            } else {
                //that.hideSuggestionsList();
                that.displaySuggestions(true);
            }
            
        }
    });
};


/* ##########
   FIND SUGGESTIONS 
   ########## */

AutoCompltr.prototype.displaySuggestions = function(showAll){

    this.HTMLSuggestionsList.style.display = 'block';
    this.pointer = -1;
    
    var suggs = "";
    var inputText = this.HTMLInput.value;

    for(var i = 0; i < this.suggestionsList.length ; i++) {
        if(this.suggestionsList[i].indexOf(inputText) >= 0 || showAll === true){
            suggs += this.insertSuggestion(i);
        }
    }
           
    this.HTMLSuggestionsList.innerHTML = suggs;
    this.clickableSuggestion('AutoCompltr-suggestion');
};

AutoCompltr.prototype.insertSuggestion = function(i){
    var sugg = '<li id="'+i+'" class="AutoCompltr-suggestion">';
    sugg += this.suggestionsList[i]; // can be modified
    sugg += '</li>';
    return sugg;
};


/* ##########
   SELECT SUGGESTIONS 
   ########## */

AutoCompltr.prototype.clickableSuggestion = function(className){

    var that = this;

    this.suggestionsFind = document.getElementsByClassName(className);
    
    if(typeof this.suggestionsFind !== 'undefined') {
        var numberOfSuggestions = this.suggestionsFind.length;

        if(numberOfSuggestions !== 0 && numberOfSuggestions !== null) {
            for(var i = 0; i < numberOfSuggestions; i++){
                this.suggestionsFind[i].addEventListener('click', function(e){
                    that.HTMLInput.value = e.srcElement.innerHTML;
                });
            }
        }
    }
};

AutoCompltr.prototype.navigation = function(keycode){

    if(this.pointer >= -1 && this.pointer <= this.suggestionsFind.length - 1){
        if(this.pointer === -1){
            if(keycode === 40)
                this.chooseFocus(keycode);
        } else if (this.pointer === this.suggestionsFind.length - 1){
            if(keycode === 38)
                this.chooseFocus(keycode);
        } else {
            this.chooseFocus(keycode);
        }
    }
};

AutoCompltr.prototype.chooseFocus = function(keycode){

    if(keycode === 40){
        if(this.pointer !== -1)
            this.removeFocus();
        this.pointer++;
        this.setFocus();
    } else if(keycode === 38) {
        this.removeFocus();
        this.pointer--;
        if(this.pointer !== -1)
            this.setFocus();
    }
};

AutoCompltr.prototype.setFocus = function(){
    this.focused = this.suggestionsFind[this.pointer].innerHTML;
    this.suggestionsFind[this.pointer].className += ' focus';
};

AutoCompltr.prototype.removeFocus = function(){
     this.focused = null;
     this.suggestionsFind[this.pointer].className += 'AutoCompltr-suggestion';
};

AutoCompltr.prototype.setInputByFocus = function(){
    this.HTMLInput.value = this.focused;
    this.removeFocus();
    this.pointer = -1;
    this.hideSuggestionsList();
};

/* ##########
   OTHER
   ########## */

AutoCompltr.prototype.setSuggestionsList = function(datas){
    //TODO : faire une meilleure vérification de la liste.

    if(typeof datas === 'object'){
        this.suggestionsList = datas;
    } else {
        console.error("Your list is not a good array or is empty.");
    }
};

AutoCompltr.prototype.hideSuggestionsList = function(){
    this.HTMLSuggestionsList.style.display = 'none';
};

AutoCompltr.prototype.getValue = function(){
    return this.HTMLInput.value;
};