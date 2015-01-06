AutoCompltr
===========

An personnal library for autocompletion. It has no dependencies and works only with javascript and CSS.

Show the demo at : [jeremieboulay.fr/projets/LIBS/autoCompltr/demo/](http://jeremieboulay.fr/projets/LIBS/autoCompltr/demo/)

## How to install

You can use bower : ``bower install auto-compltr``

You can also use gitHub : ``git clone https://github.com/Jeremboo/autoCompltr``

Then, add in your HTML page :

A CSS link : ``<link rel="stylesheet" href="bower_components/autoCompltr/dist/css/autoCompltr.css">``

A javascript link : ``<script src="bower_components/autoCompltr/dist/js/autoCompltr.js"></script>``

## Getting started

For use this libs, you must have two things :

- A empty ``<div>`` element  in your DOM.

		<div id="my-div"></div>
	
- An array with all suggestions in your JS.

		var tblSugg = ['sugg1','sugg2','...'];

In your JS script, select your empty ``<div>`` and create a new AutoCompltr object.

		var wrapper = document.getElementById('my-div');
		var completer = new AutoCompltr(wrapper,tblSugg);

The array of suggetions of second parameter is not required for the begining. But your auto completion will not work if you have not indicate your suggestions list. So if you do not provide the second parameter the first time, you must be call ``setSuggestionsList`` method :

		completer.setSuggestionsList(['sugg1','sugg2','...']);

## Other methods

- If you want get value in javascript for other reason, you can use ``getValue()`` method :

		completer.getValue();

- If you want added actions when enter is pressed, use ``onEnter()`` :

        completer.onEnter(funcion(){
            ...
        },false);

    The second parameter is used when you want execuded this method only once. ``true`` for only once, ``false`` for the times (by default).


## ABOUT 


I wanted have a simple and independent system. I helped myself two other works :

- [complete.ly](http://complete-ly.appspot.com/) by Lorenzo Puccetti
- [completer](http://demos.e-lless.be/completer/) by Lebleu Steve

