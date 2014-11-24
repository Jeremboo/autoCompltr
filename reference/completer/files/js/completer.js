/* 
 * Completer is a free script that implements an auto-completion system using AJAX technologies
 * 
 * Copyright (C) 2014  Lebleu Steve <dev@e-lless.be>
 * 
 * URL : http://scripts.e-lless.be/completer/

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Creative Commons Licence.
 *
 */


/**
 * Implement JSON.parse de-serialization
 * 
 * @type @exp;JSON
 */
var JSON = JSON || {};

JSON.parse = JSON.parse || function (str) {
    
    if (str === "") 
    {
        str = '""';
    }
    
    eval("var p =" + str + ";");
    
    return p;
};
 
/**
 * IE <= 8 document.getElementsByClassName polyfill
 * 
 * @param {string} className
 * @returns {NodeList}
 */
if (typeof document.getElementsByClassName!='function') {
    document.getElementsByClassName = function() {
        var elms = document.getElementsByTagName('*');
        var ei = new Array();
        for (i=0;i<elms.length;i++) {
            if (elms[i].getAttribute('class')) {
                ecl = elms[i].getAttribute('class').split(' ');
                for (j=0;j<ecl.length;j++) {
                    if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                        ei.push(elms[i]);
                    }
                }
            } else if (elms[i].className) {
                ecl = elms[i].className.split(' ');
                for (j=0;j<ecl.length;j++) {
                    if (ecl[j].toLowerCase() == arguments[0].toLowerCase()) {
                        ei.push(elms[i]);
                    }
                }
            }
        }
        return ei;
    }
}

/**
 * IE <= 8 addEventListener polyfill
 * 
 * @param {HTMLElement} element
 * @param {string} event
 * @param {function} func
 * @returns {void}
 */
function AddEvent(element, event, func) {
    
    if(element.addEventListener)
    {
        element.addEventListener(event, func, false);
    }
    else 
    {
        element.attachEvent('on' + event, func);
    }
}

/**
 * Polyfill for XHR implements
 * 
 * @returns {XMLHttpRequest.XMLHttpRequest|Boolean|XMLHttpRequest|ActiveXObject|ActiveXObject.ActiveXObject}
 */
function GetXmlHttpRequest() {
                
    var xhr;
    
    if(window.XMLHttpRequest)
    {
        return xhr = new XMLHttpRequest();
    }  
    else if(window.ActiveXObject) 
    {
    	var versions = [
			            "Msxml2.XMLHTTP.6.0",
			            "Msxml2.XMLHTTP.3.0",
			            "Msxml2.XMLHTTP",
			            "Microsoft.XMLHTTP"
			        ];

        for(var i in versions)
        {
	        try
	        {
	            return xhr = new ActiveXObject(versions[i]);
	        }
	        catch (e){} 
        }
    }
    else 
    {
        alert("Votre navigateur ne supporte pas l'objet XMLHttpRequest");
        return xhr = false;
    }
}

// TODO setTimeout sur l'affichage des résultats : masquer après x secondes ?

if(typeof Completer === 'undefined')
{
    var Completer = {

        ConfigPath: 'php/configurer.php',
        PHPPath: 'php/completer.php',
        Properties: [],
        Suggestions: [],
        Pointer: -1,
        PreviousValue: '',
        Focused: null,      
        Input: null,
        Result: null, 
        Response: {},

        /**
         * Init elements & events
         * 
         * @returns {undefined}
         */
        Init: function() {
            
            Completer.SetProperties();
            
            var result = document.createElement('div');
                result.id = "result";
                result.className = "form--lightsearch__result";
            
            this.Result = result;

            var searcher = document.getElementById('searcher');
                searcher.appendChild(result);
            
            this.Input = document.getElementById('autocomplete');

            this.EventHandlers.KeyboardNavigation(); 
            this.EventHandlers.HideResults(this.Result);
        },
        
        EventHandlers: {

            /**
             * Gestion of keyboard
             * 
             * @returns {undefined}
             */
            KeyboardNavigation: function() {

                AddEvent(Completer.Input, 'keyup', function(e) {
                
                    e = e || window.event;
                    
                    var keycode = e.keyCode;

                    // Up/Down into Results
                    if(keycode === 38 || keycode === 40)
                    {
                        Completer.Navigation(keycode);
                    } 
                    // Write the selected item into Input
                    else if (keycode === 13)
                    {
                        Completer.InsertSuggestion();
                    }
                    else 
                    {
                        if(Completer.Input.value !== Completer.PreviousValue)
                        {
                            Completer.DisplaySuggestions(); 
                        }  
                    }
                });
            },

            /**
             * Hide set of results after click on body
             * 
             * @params {HTMLElement}
             * @returns {undefined}
             */
            HideResults: function(elm) {

                AddEvent(document.body, 'click', function() {
                    elm.style.display = 'none';
                });
            },

            /**
             * Set click event on Suggestions div's
             * 
             * @param {string}
             * @returns {undefined}
             */
            ClickableSuggestion: function(nameClass) {

                Completer.Suggestions = document.getElementsByClassName(nameClass);
                
                if(typeof Completer.Suggestions !== 'undefined')
                {
                    var numberOfSuggestions = Completer.Suggestions.length; 

                    if(numberOfSuggestions !== 0 && numberOfSuggestions !== null)
                    {
                        for(var i = 0; i < numberOfSuggestions; i++)
                        {
                            AddEvent(Completer.Suggestions[i], 'click', (function(i) {
                               return function() {
                                    Completer.Focused = Completer.Suggestions[i];
                                    Completer.InsertSuggestion();
                               }; 
                            })(i)); 
                        }  
                    }
                }    
            }
        },

        /**
         * Set properties of the screenview
         * 
         * @returns {undefined}
         */
        SetProperties: function() {
            
            var xhr = GetXmlHttpRequest();
            xhr.open('GET', Completer.ConfigPath, true);

            xhr.onreadystatechange = function() {

                if(xhr.readyState === 4 && xhr.status === 200)
                {
                    var response = xhr.responseText;
                    Completer.Properties = response.split(', ');
                }
            };

            xhr.send(null);
        },
        
        /**
         * Gestion of navigation into results of the request
         * 
         * @param {int} keycode
         * @returns {undefined}
         */
        Navigation: function(keycode) {

            if(Completer.Pointer >= -1 && Completer.Pointer <= Completer.Suggestions.length - 1)
            {
                // Pointer out of data set, before first element
                if(Completer.Pointer === -1)
                {
                    if(keycode === 40)
                    {
                        Completer.SetFocus(keycode);
                    }    
                }
                // Pointer in data set, at last element
                else if (Completer.Pointer === Completer.Suggestions.length - 1) 
                {
                    if(keycode === 38)
                    {
                        Completer.SetFocus(keycode);
                    }   
                }
                // Pointer into data set
                else 
                {
                    Completer.SetFocus(keycode);
                }
            }    
        },

        /**
         * Init XHR object, send the AJAX request and display Result
         * If you use another datas set, modify only this method
         * 
         * @returns {undefined}
         */
        DisplaySuggestions: function() {

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
        },


        /**
         * Insert a suggestion into Input file
         * 
         * @returns {undefined}
         */
        InsertSuggestion: function() {
            
            var id;
            
            Completer.Focused !== null ? id = Completer.Focused.id : id = 0;    
            Completer.Input.value = Completer.Response[id][0]; // Update this line with anonymous Property
            Completer.Pointer = -1;
            Completer.Result.style.display = 'none';
        },
        
        /**
         * Set focus params for keyboard Navigation
         * 
         * @param {int} keycode of the Navigation (38/40)
         * @returns {undefined}
         */
        SetFocus: function(keycode) {

            if(keycode === 40)
            {
                if(this.Pointer !== -1)
                {
                    Completer.RemoveFocus();
                } 
                Completer.Pointer++;
                Completer.GetFocus();
            }
            else if(keycode === 38)
            {
                Completer.RemoveFocus();
                Completer.Pointer--;
                if(Completer.Pointer !== -1)
                {
                    Completer.GetFocus();   
                }   
            }
        },

        /**
         * Get the focus on one element & set Focused property
         * 
         * @returns {undefined}
         */
        GetFocus: function() {
            Completer.Focused = Completer.Suggestions[Completer.Pointer]; 
            Completer.Suggestions[Completer.Pointer].className += ' focus';
        },

        /**
         * Remove the focus on one element & set Focused property
         * 
         * @returns {undefined}
         */
        RemoveFocus: function() {
            Completer.Focused = null;
            Completer.Suggestions[Completer.Pointer].className = 'item--result';
        }
    };
}
else 
{
    console.log('This namespace already exists !');
}

Completer.Init();

