function AutoCompltr(wrapper, datas){

    this.wrapper = wrapper;
    this.datas = datas || [];
    this.suggestions = [];
    this.input;
    this.DOMsuggestionList;

    init();

};

AutoCompltr.prototype.init = function(){

    //TODO : crée un élément input text a mettre dans le wrapper avec la class : XXXX

    /* EVENTS */
    this.keyboardNavigation();
    document.body.addEventListener('click',function(){
        this.hideElm(this.DOMsuggestionsList);
    });
};

// Gestion des énènements
AutoCompltr.prototype.keyboardNavigation = function(){

    this.input.addEventListener('keyup',function(e){

        e = e || window.event;
        
        var keycode = e.keyCode;

        if(keycode === 38 || keycode === 40) {
            this.navigation(keycode);
        } else if (keycode === 13) {
            this.insertSuggestion();
        } else {
            if(this.input.value !== this.previousValue)
            {
                this.displaySuggestions();
            }
        }
    });
};

AutoCompltr.prototype.hideElm = function(elm){
        elm.style.display = 'none';
};

AutoCompltr.prototype.clickableSuggestion = function(nameClass){

    this.suggestions = document.getElementsByClassName(nameClass);
    
    if(typeof this.suggestions !== 'undefined') {
        var numberOfSuggestions = this.suggestions.length;

        if(numberOfSuggestions !== 0 && numberOfSuggestions !== null) {
            for(var i = 0; i < numberOfSuggestions; i++){

                this.suggestions[i].addEventListener('click', function(i){
                    return function(){
                        this.focused = this.suggestions[i];
                        this.insertSuggestion();
                    };
                })(i);
            }
        }
    }
};



AutoCompltr.prototype.Navigation = function(){

};

AutoCompltr.prototype.DisplaySuggestions = function() {

    AutoCompltr.Result.style.display = 'block';
    AutoCompltr.Pointer = -1;
    
    var text = "",
        xhr = GetXmlHttpRequest();

    xhr.open('POST', AutoCompltr.PHPPath, true);

    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {

        if(xhr.readyState === 4 && xhr.status === 200)
        {
            var response = JSON.parse(xhr.responseText);     

            if(response !== null)
            {
                AutoCompltr.Response = response;

                var properties = AutoCompltr.Properties.length,
                    responseLength = response.length;

                for(var i = 0; i < responseLength ; i++)
                {
                    if(typeof response[i] !== 'undefined')
                    {
                        var cls;
                        
                        i + 1 === responseLength ? cls = 'last' : cls = '';
                        
                        text += "<div id=\"" + i + "\" class=\"item--result " + cls + "\">\n";
                    
                        for(var j = 0; j < properties; j++)
                        {
                            text += "<span class=\"data-" + j + "\">" + response[i][j] + "</span>\n";
                        }

                        text += "</div>\n";
                    }  
                }  
            }
            else 
            {
                text = "<div class=\"item--result\">Not found</div>";
            }
        }
        else if(xhr.readyState === 4 && xhr.status !== 200)
        {
            text = "<div class=\"item--result\">Error</div>";
        }

        AutoCompltr.Result.innerHTML = text;
        
        AutoCompltr.EventHandlers.ClickableSuggestion('item--result');
    };

    xhr.send('requestExpression=' + AutoCompltr.Input.value);    
    

};

AutoCompltr.prototype.InsertSuggestion = function() {
    
};

AutoCompltr.prototype.SetFocus = function() {
    
};

AutoCompltr.prototype.GetFocus = function() {
    
};

AutoCompltr.prototype.RemoveFocus = function() {
    
};