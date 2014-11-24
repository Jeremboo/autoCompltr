function Completer(){

    this.properties = []; // propriéré de la BDD
    this.suggestions = [];
    this.pointer = -1;
    this.previousValue = "";
    this.focused = null;
    this.input = null;
    this.result = null;
    this.response = {};
};

Completer.prototype.init = function(){


    var result = document.createElement('div');
        result.id = "result";
        result.className = "form--lightsearch__result";
    
    this.Result = result;

    var searcher = document.getElementById('searcher');
        searcher.appendChild(result);
    
    this.Input = document.getElementById('autocomplete');

    this.keyboardNavigation();
    this.hideResults();


};

// Gestion des énènements
Completer.prototype.keyboardNavigation = function(){

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

Completer.prototype.hideResult = function(elm){
    //cacher la liste des resultats quand on 
    document.body.addEventListener('click', function(){
        elm.style.display = 'none';
    });
};

Completer.prototype.clickableSuggestion = function(nameClass){

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



Completer.prototype.Navigation = function(){

};

Completer.prototype.DisplaySuggestions = function() {

    Completer.Result.style.display = 'block';
    Completer.Pointer = -1;
    
    var text = "",
        xhr = GetXmlHttpRequest();

    xhr.open('POST', Completer.PHPPath, true);

    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {

        if(xhr.readyState === 4 && xhr.status === 200)
        {
            var response = JSON.parse(xhr.responseText);     

            if(response !== null)
            {
                Completer.Response = response;

                var properties = Completer.Properties.length,
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

        Completer.Result.innerHTML = text;
        
        Completer.EventHandlers.ClickableSuggestion('item--result');
    };

    xhr.send('requestExpression=' + Completer.Input.value);    
    

};

Completer.prototype.InsertSuggestion = function() {
    
};

Completer.prototype.SetFocus = function() {
    
};

Completer.prototype.GetFocus = function() {
    
};

Completer.prototype.RemoveFocus = function() {
    
};