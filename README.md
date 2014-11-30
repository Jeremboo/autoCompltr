AutoCompltr
===========

An personnal library for autocompletion. It has no dependencies and works only with javascript and CSS.

I wanted have a simple and independent system. I helped myself two other works :

- [complete.ly](http://complete-ly.appspot.com/) by Lorenzo Puccetti
- [completer](http://demos.e-lless.be/completer/) by Lebleu Steve

## How to install

You can use bower : ``bower install autCompltr``

You can also use gitHub : ``git clone https://github.com/Jeremboo/AutoCompltr``

## Getting started

For use this libs, you must have two things :

- A ``<div>`` element empty in your DOM.
- An array with all suggestions.

Select your empty ``<div>`` with javascript and create a new AutoCompltr object.

		var wrapper = document.getElementById('my-div');
		var completer = new AutoCompltr(wrapper,['sugg1','sugg2','...']);

The array of suggetions of second parameter is not required for the begining. But your auto completion will not work if you have not indicate your suggestions list. So if you do not provide the second parameter the first time, you must be call ``setSuggestionsList`` method :

		completer.setSuggestionsList(['sugg1','sugg2','...']);

If you want get value in javascript for other reason, you can use ``getValue()`` method :

		completer.getValue();