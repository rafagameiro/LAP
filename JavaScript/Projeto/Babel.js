/*

Babel.js - AMD/2018

    *** REESCREVA ESTE TEXTO! ***
    
Autores: Rafael Gameiro (50677), Pedro Valente (50759)

The objetives of the project were fulfilled.
We're able to implement all screens and both lessons,
Japanese and Portuguese.
Drag and drop was implement as best as possible, being
able to correctly to do the block's and symbol's screen.

01234567890123456789012345678901234567890123456789012345678901234567890123456789

*/

/* Global variables */

var xmlDoc, xmlSerializer, languageName, language;;

/* Classes*/

/*
*Class screen represents a screen of the application
*this class extends to a keyboard screen, a pair screen, a blocks screen and a symbols screen
*each one of this represents a possible presentable screen
*/
class Screen {
	constructor(prompt, type) {
		this.prompt = prompt;
		this.type = type;
	}
	
	getPrompt() {
		return this.prompt;
	}
	
	getType() {
		return this.type;
	}
}

/*
*This class represents a Keyboard screen from the xml file we extract and store in this class
*the prompt, the original sentence, the translation or possible translations an the sound 
*/
class Keyboard extends Screen{
	constructor(prompt, type, original, translation, sound) {
		super(prompt, type);
		this.original = original;
		this.translation = translation;
		this.sound = sound;
	}
	
	getOriginal() {
		return this.original;
	}
	
	getTranslation() {
		return this.translation;
	}
	
	getSound() {
		return this.sound;
	}
}

/*
*This class stores 2 strings and it's used to aid in the creation of the screen Pair
*one of the strings corresponds to the untranslated word and the other to the translated word
*/
class PairSolution{
	constructor(match, pair){
		this.match = match;
		this.pair = pair;
	}
	
	getMatch() {
		return this.match;
	}
	
	getPair() {
		return this.pair;
	}
}

/*
*This class represents a Pair screen from the xml file we extract and store in this class
*the prompt, the original sentence and the solution
*/
class Pair extends Screen{
	constructor(prompt, type, original, solution){
		super(prompt, type);
		this.original = original.split(" ");
		this.solution = [];
		this.savePairs(solution, this.solution);
	}
	
	getOriginal() {
		return this.original;
	}
	
	getSolution() {
		return this.solution;
	}
	
	//this function is used to seperate solution into an array of solution pairs 
	savePairs(solution, solutionPair) {
		var solutionSplitted = solution.split(" ");
		for(var i = 2; i <= solutionSplitted.length;i+=2) 
			solutionPair.push(new PairSolution(solutionSplitted[i-2], solutionSplitted[i-1]));
	}
}

/*
*This class represents a Symbols screen from the xml file we extract and store in this class
*the Symbname, the Alaphabet, the latin correspondence, the sound dir and the comment 
*/
class Symbols extends Screen{
	constructor(symbName, prompt, type, alphabet, latin, soundsdir, comment) {
		super(prompt, type);
		this.symbName = symbName;
		this.alphabet = alphabet.split(" ");
		this.latin = latin.split(" ");
		this.soundsdir = soundsdir;
		this.comment = comment;
		this.match = this.processMatch(this.alphabet, this.latin);
		this.match = this.processMatch(this.alphabet, this.latin);
	}
	
	getSymbName() {
		return this.symbName;
	}
	
	getAlphabet() {
		return this.alphabet;
	}
	
	getLatin() {
		return this.latin;
	}
	
	getSoundsDir() {
		return this.soundsdir;
	}
	
	getComment() {
		return this.comment;
	}
	
	getSolutions() {
		return this.match;
	}
	
	processMatch(alphabet, latin) {
		var solution = [];
		for(var i = 0; i < alphabet.length;i++) 
			solution.push(new PairSolution(alphabet[i], latin[i]));
		return solution;
	}
}

/*
*This class represents a Pair screen from the xml file we extract and store in this class
*the prompt, the original sentence, a number of blocks and the solution
*/
class Block extends Screen{
	constructor (prompt, type, original, blocks, solution){
		super(prompt, type);
		this.original = original;
		this.blocks = blocks.split(" ");
		this.solution = solution;
	}
	
	getOriginal() {
		return this.original;
	}
	
	getBlocks() {
		return this.blocks;
	}
	
	getSolution() {
		return this.solution;
	}
}

/*
*The class lesson is used to store an array os screens, this array is based on the xml file
*each lesson is comprised of a set of screens 
*/
class lesson {
	
	constructor(node, i){
		if ( i == 0 ) 
			this.screens = this.processScreen(node.childNodes);
		else 
			this.screens = this.processScreenWSymbols(node.childNodes); //TODO: Not sure if correct
		
	}
	
	getScreen(id) {
		return this.screens[id];
	}
	
	getNumOfScreens() {
		return this.screens.length;
	}
	
	/*
	*This function receives a child node from the xml file and if the type of the screen is a keyboard screen
	*this function gets called
	*/
	processKeyboard(node){ 
		var prompt, original, sound;
		var translation = [];
		for(var i = 1; i < node.length; i+=2){
			if(node[i].tagName == "PROMPT")
				prompt = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "ORIGINAL")
				original = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "SOUND")
				sound = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "TRANSLATION") 
				translation.push(node[i].childNodes[0].nodeValue);
		}
		
		return new Keyboard(prompt, "keyboard", original, translation, sound);
	}
	
	/*
	*This function receives a child node from the xml file and if the type of the screen is a Pair screen
	*this function gets called
	*/
	processPairs(node){
		var prompt, solution;
		var original = [];
		for(var i = 1; i < node.length;i+=2) {
			if(node[i].tagName == "PROMPT")
				prompt = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "ORIGINAL")
				original = node[i].childNodes[0].nodeValue;
			else
				solution = node[i].childNodes[0].nodeValue;
		}

		return new Pair(prompt, "pairs", original, solution);
	}
	
	/*
	*This function receives a child node from the xml file and if the type of the screen is a Blocks screen
	*this function gets called
	*/
	processBlocks(node){
		var prompt, original, blocks, solution;
		for(var i = 1; i < node.length;i+=2){
			if(node[i].tagName == "PROMPT")
				prompt = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "ORIGINAL")
				original = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "BLOCKS")
				blocks = node[i].childNodes[0].nodeValue;
			else
				solution = node[i].childNodes[0].nodeValue;
		}

		return new Block(prompt, "blocks", original, blocks, solution);
		
	}
	
	/*
	*This function is used to process a lesson it receives a node from the xml file and goes through the lesson node
	*for each child the function creates a correspondent screen object in the end it returns an arrray containing
	*every screen for this lesson
	*/
	processScreen(lesson){
		var screensProcessed = [];
		var j = 0;
		for(var i = 1; i < lesson.length; i+=2) {
			var child = lesson[i];
			var currScreen;
			if(child.tagName == "KEYBOARD")
				currScreen = this.processKeyboard(child.childNodes);
			else if(child.tagName == "PAIRS")
				currScreen = this.processPairs(child.childNodes);
			else	
				currScreen = this.processBlocks(child.childNodes);
			screensProcessed.push(currScreen);
		}
		return screensProcessed;
	}
	
}

/*
*The class Language stores an array of lessons 
*/
class Language {
	
	//the constructor receives the xml file and converts it into an array of lessons using the function 
	//processLessons
	constructor(lessons, type){
		this.lessons = this.processLessons(lessons); 
		this.type = type;
	}
	
	/*
	*This function receives the xml file and stores the information on an array of lessons
	*/
	processLessons(lessons){
		var lessonsStored = new Array (lessons.length)
		for( var i = 0; i < lessons.length; i++ ){
			lessonsStored[i] =  new lesson( lessons[i], 0 );
		}
		return lessonsStored;
	}
	
	getType() {
		return this.type;
	}
	
	getNumOfLessons() {
		return this.lessons.length;
	}
	
	getScreenLength() {
		return this.screen.getNumOfScreens();
	}
	
	getCurrent() {
		return this.current;
	}
	
	startLesson(id) {
		this.screen = this.lessons[id-1];
		this.current = 0;
	}
	
	hasNextScreen() {
		return this.current < this.screen.getNumOfScreens();
	}
	
	nextScreen(){
		return this.screen.getScreen(this.current++);
	}
	
	getScreen() {
		return this.screen.getScreen(this.current);
	}
	
}

/*
*This class extends the class Language and it changes the function processLessons in order to support
*the screen Symbols
*/
class LanguageExtraAlphabets extends Language {
	
	constructor(lessons, symbols, type){
		super(lessons, type);
		this.symbols = this.processSymbols(symbols); 
	}
	
	getNumOfSymbols() {
		return this.symbols.length;
	}
	
	startSymbol(id) {
		this.currSymbol = this.symbols[id-1];
	}
	
	getSymbol() {
		return this.currSymbol;
	}
	
	processSymbols(symbols) {
		var processedSymbols = [];
		for(var i = 0; i < symbols.length;i++){
			processedSymbols.push(this.processSymb(symbols[i].childNodes));
		}
		return processedSymbols;
	}
	
	/*
	*This function is used to process a lesson it receives a node from the xml file and goes through the lesson node
	*for each child the function creates a correspondent screen object in the end it returns an arrray containing
	*every screen for this lesson, this function gets added the fact that it can process a screen with symbols 
	*so this function is only used in the class LanguageExtraAlphabets
	*/
	processSymb(node){
		var prompt, symbName, alphabet, latin, soundsDir, comment;
		for(var i = 1; i < node.length;i+=2) {
			if(node[i].tagName == "PROMPT")
				prompt = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "SYMBNAME")
				symbName = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "ALPHABET")
				alphabet = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "LATIN")
				latin = node[i].childNodes[0].nodeValue;
			else if(node[i].tagName == "SOUNDSDIR")
				soundsDir = node[i].childNodes[0].nodeValue;
			else
				comment = node[i].childNodes[0].nodeValue;
		}
		
		return new Symbols(symbName, prompt, "symbols", alphabet, latin, soundsDir, comment);
	}
	
}

/*
*We use this class to dynamically build the screens, using functions like 
*document.createElement and xmlDoc.getElementsByTagName
*/ 
class dynamicHTML {
	
	constructor() {
	}
	
	/* Misc functions */
	static play(sound) {
		const soundEnabled = true;
		const prefix = "http://ctp.di.fct.unl.pt/miei/lap/projs/proj2018-3/files/resources/sounds/";
		if( soundEnabled )
			new Audio(prefix + sound).play();
		else
			alert("SOUND: " + sound);
	}

	static validate(answer, solution) {
		if( answer == solution )
			this.play("general/right_answer.mp3");
		else
			this.play("general/wrong_answer.mp3");
	}

	/* XML */
	/*       https://www.w3schools.com/xml/default.asp  */

	static text2XML(text) {
		var parser = new DOMParser();
		var serializer = new XMLSerializer();
		xmlDoc = parser.parseFromString(text,"text/xml");
		return xmlDoc;
	}

	XML2Text(xml) {
		return xmlSerializer.serializeToString(xml);
	}
		
	static eventHandler(a, kind, action) {
		a[kind] = new Function(action);
		return a;
	}
	
	static eventHandler2(a, kind, action) {
		a[kind] = action;
		return a;
	}
	
	/* JavaScript HTML DOMhttps://www.w3schools.com/js/js_htmldom.asp */
	/*        https://www.w3schools.com/js/js_htmldom.asp */ 	

	static h1(target, text) {
		var a = document.createElement("H1");
		var b = document.createTextNode(text);
		a.appendChild(b);
		target.appendChild(a);
		return a;
	}
	
	static h3(target, text) {
		var a = document.createElement("H3");
		var b = document.createTextNode(text);
		a.appendChild(b);
		target.appendChild(a);
		return a;
	}

	static hr(target) {
		var a = document.createElement("HR");
		target.appendChild(a);
		return a;
	}

	static p(target, style) {
		var a = document.createElement("P");
		a.style = style;
		target.appendChild(a);
		return a;
	}

	static br(target) {
		var a = document.createElement("BR");
		target.appendChild(a);
		return a;
	}

	static text(target, fsize, t) {
		var a = document.createElement('SPAN');
		var b = document.createTextNode(t);
		a.appendChild(b);
		a.style.fontSize = fsize + "px";
		target.appendChild(a);
		return a;
	}

	static img(target, url) {
		var a = document.createElement("IMG");
		a.src = url;
		target.appendChild(a);
		return a;
	}

	static inputActiveText(target, id, size, fsize, placeholder) {
		var a = document.createElement("INPUT");
		a.type = "text";
		a.id = id;
		a.value = "";
		a.placeholder = placeholder;
		a.style.fontSize = fsize + "px";
		a.size = size;
		target.appendChild(a);
		return a;
	}   
	
	//We created this static element to help us create draggable divisions in the screen Blocks
	static dragabble(target, id, value, style) {
		var a = document.createElement("DIV");
		a.draggable = "true";
		//TODO
		a.id = id;
		a.value = value;
		a.style = style + "float: left; border: 1px solid black; cursor: move; text-align: center; margin: 5px 5px";
		var b = document.createElement('SPAN');
		var c = document.createTextNode(value);
		b.appendChild(c);
		b.style.fontSize = "16px";
		a.appendChild(b);
		target.appendChild(a);
		return a;
	}
	
	//We created this static element to help us create draggable divisions in the screen Symbols
	static draggableText(target, id, value, style) {
		var a = document.createElement("DIV");
		//TODO
		a.id = "div "+id;
		a.value = value;
		a.style = style + "float: left; border: 1px solid black; cursor: move; text-align: center; margin: 5px 5px";
		var b = document.createElement('SPAN');
		var c = document.createTextNode(value);
		b.draggable = "true";
		b.id = "span "+id;
		b.appendChild(c);
		b.style.fontSize = "16px";
		a.appendChild(b);
		target.appendChild(a);
		return a;
	}
	
	//We created this static element to help us create single destination divisions in the screen Symbols
	static dest(target, id, value, style) {
		var a = document.createElement("DIV");
		a.draggable = "false";
		//TODO
		a.id = id;
		a.value = value;
		a.style = style + "visiblity: ;float: left; border: 1px solid black; cursor: move; text-align: center; margin: 5px 5px";
		var b = document.createElement('SPAN');
		var c = document.createTextNode(value);
		b.appendChild(c);
		b.style.fontSize = "16px";
		a.appendChild(b);
		target.appendChild(a);
		return a;
	}

	static inpuButton(target, id, value, color) {
		var a = document.createElement("INPUT");
		a.type = "button";
		a.id = id;
		a.value = value;
		a.style.backgroundColor = color;
		target.appendChild(a);
		return a;
	}

	static inpuFile(target, id ) {
		var a = document.createElement("INPUT");
		a.type = "file";
		a.id = id;
		target.appendChild(a);
		return a;
	}

	static div(target, style) {
		var a = document.createElement("DIV");
		a.style = style;
		target.appendChild(a);
		return a;    
	}
	
	//Div blocks
	static divBlocks(target, style, id) {
		var a = document.createElement("DIV");
		a.id = id;
		a.style = style;
		target.appendChild(a);
		return a;    
	}
	
}

/*
*We use this class create the screens that we are going to use it also works as sort of a main
*/
class startup { 

	constructor(){
		this.html = new dynamicHTML();
		startup.screen0();
	}
	
	/* Local files */
	/*        https://www.javascripture.com/FileReader */

	static processLocalFile(e, processor) {
		var file = e.target.files[0];
		if (!file) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(e) {
			processor(e.target.result);
		};
		reader.readAsText(file, "UTF-8");
	}

	static screen0() {
		var self = this;
		var body = document.body;
	// start with a blank page
		body.innerHTML = '';
		
	// load the language XML
		var f = dynamicHTML.inpuFile(body, "file-input");
		dynamicHTML.eventHandler(f, "onchange", " startup.processLocalFile(event, startup.runLanguage);");
	}
	
	/*
	*This static function creates the screen Symbols 
	*/
	static screenSymbols() {
		var body = document.body;
		var screen = language.getSymbol();
	// start with a blank page
		body.innerHTML = '';
		
		dynamicHTML.h1(body, "Babel   (" + languageName + ")");
		dynamicHTML.hr(body);
		
	// a div, only because we want a border
		var d = dynamicHTML.div(body, "border:3px solid black; display:table; padding:20px; height: 200px;width: 1200px;");
		dynamicHTML.h1(d, screen.getSymbName());
		
		if(screen.getPrompt() != undefined)
			dynamicHTML.h3(d, screen.getPrompt());

	// first line
		var p1 = dynamicHTML.p(d, "padding-left:40px; word-spacing:50px;");
		dynamicHTML.text(p1, 16, " ");

	// second line
		var p2 = dynamicHTML.p(d, "padding-left:20px;");
		
	//This cycle creates the destinations of the draggable objects
		var drag = dynamicHTML.div(d, "border:1px; background-color: hsl(0, 2%, 95%); padding:15px; height: 450px; width: 1100px");
		var latin = screen.getLatin();
		var alphabet = screen.getAlphabet();
		for(var i = 0; i < latin.length; i++) {
			var div = dynamicHTML.div(drag, "float: left; border:1px ; background-color: hsl(0, 2%, 95%); padding:10px; height: 25px; width: 200px;");
			var dest = dynamicHTML.dest(div, i, " ", "height: 25px;width: 100px; background-color: white;"); //<--New 
			dynamicHTML.text(div, 18, latin[i]); 
			dynamicHTML.eventHandler2(dest, "ondragover", function() {dropOver(event)});
			dynamicHTML.eventHandler2(dest, "ondrop", function() {checkSymbols(event,screen.getSolutions())});
		}
		dynamicHTML.br(d);
		
	//This cycle creates the draggable texts 
		for(var i = 0; i < alphabet.length; i++) {
			var draggable = dynamicHTML.draggableText(d, i + alphabet.length, alphabet[i], "height: 25px;width: 100px; background-color: white;");
			dynamicHTML.text(d, 50, " ");
			dynamicHTML.eventHandler2(draggable, "ondragstart", function() {dragStart(event)});
		}
		
	}
	
	/*
	*This static function creates the screen Blocks 
	*/
	static screenBlocks() {
		var body = document.body;
		var screen = language.nextScreen();
	// start with a blank page
		body.innerHTML = '';
		
		dynamicHTML.h1(body, "Babel   (" + languageName + ")");
		dynamicHTML.hr(body);
		
	// a div, only because we want a border
		var d = dynamicHTML.div(body, "border:3px solid black; display:table; padding:20px; height: 200px;");
		dynamicHTML.h1(d, screen.getPrompt());

	// first line
		var p1 = dynamicHTML.p(d, "padding-left:40px; word-spacing:50px;");
		dynamicHTML.text(p1, 16, " ");
		dynamicHTML.text(p1, 32, screen.getOriginal());

	// second line
		var drag = dynamicHTML.divBlocks(d, "border:1px; background-color: hsl(0, 2%, 95%); padding:15px;", "drag");
		dynamicHTML.eventHandler2(drag, "ondrop", function() {drop(event)});
		dynamicHTML.eventHandler2(drag, "ondragover", function() {dropOver(event)});
		dynamicHTML.hr(d);
		var drag2 = dynamicHTML.divBlocks(d, "border:1px; background-color: hsl(0, 2%, 95%); padding:15px;", "drag2");
		dynamicHTML.eventHandler2(drag2, "ondrop", function() {drop(event)});
		dynamicHTML.eventHandler2(drag2, "ondragover", function() {dropOver(event)});
		dynamicHTML.hr(d);
		
	//This cycle creates the draggable text boxes
		var defaultDrag = dynamicHTML.div(d, "border:1px; background-color: hsl(0, 1%, 98%); padding:10px; height: 75px;");
		dynamicHTML.eventHandler2(defaultDrag, "ondrop", function() {drop(event)});
		dynamicHTML.eventHandler2(defaultDrag, "ondragover", function() {dropOver(event)});
		var blocks = screen.getBlocks();
		for(var i = 0; i < blocks.length;i++) {
			var draggable = dynamicHTML.dragabble(defaultDrag, i, blocks[i], "height: 25px;width: 100px; background-color: white;");
			dynamicHTML.text(d, 50, " ");
			dynamicHTML.eventHandler2(draggable, "ondragstart", function() {dragStart(event)});
		}
		
	//We use this button to check if the texts match 
		dynamicHTML.p(d, "padding-left:40px; word-spacing:50px;");
		dynamicHTML.br(d);
		var b1 = dynamicHTML.inpuButton(d, "check", "Check", "lime");
		dynamicHTML.eventHandler2(b1, "onclick", function() {checkBlocks ("drag", "drag2", screen.getSolution())});
		
		dynamicHTML.br(body);
		var d2 = dynamicHTML.div(body, "border:3px solid black; display:block; padding: 5px; text-align: center; height: 15px;width: 100px;");
		dynamicHTML.text(d2, 16, language.getCurrent() + "/" + language.getScreenLength());
		dynamicHTML.hr(body);
	}
	
	/*
	*This static function creates the screen Pairs 
	*/
	static screenPairs() {
		var self = this;
		var body = document.body;
		var screen = language.nextScreen();
	// start with a blank page
		body.innerHTML = '';
		
		dynamicHTML.h1(body, "Babel   (" + languageName + ")");
		dynamicHTML.hr(body);
		
	// a div, only because we want a border
		var d = dynamicHTML.div(body, "border:3px solid black; display:table; padding:20px; height: 200px;width: 800px;");
		dynamicHTML.h1(d, screen.getPrompt());

	// first line
		var pair1 = null;
		var pair2 = null;
	
	//This cylce is used to generate the input buttons 
		var p2 = dynamicHTML.p(d, "padding-left:20px;");
		var original = screen.getOriginal();
		for(var i = 0; i < original.length;i++) {
			var b = dynamicHTML.inpuButton(d, i, original[i], "white");
			dynamicHTML.text(d, 50, " ");
			dynamicHTML.eventHandler2(b, "onclick", function() {pair1 = (pair1 == null)?original[event.target.id]:definePair(pair1, pair2, event.target.id, original, screen.getSolution())});
		}

		dynamicHTML.br(body);
		var d2 = dynamicHTML.div(body, "border:3px solid black; display:block; padding: 5px; text-align: center; height: 15px;width: 100px;");
		dynamicHTML.text(d2, 16, language.getCurrent() + "/" + language.getScreenLength());
		dynamicHTML.hr(body);
	}

	/*
	*This static function creates the screen Keyboard 
	*/
	static screenKeyboard() {
		var body = document.body;
		var screen = language.nextScreen();
	// start with a blank page
		body.innerHTML = '';

		dynamicHTML.h1(body, "Babel   (" + languageName + ")");
		dynamicHTML.hr(body);
		
	// a div, only because we want a border
		var d = dynamicHTML.div(body, "border:3px solid black; display:table; padding:20px; height: 200px;width: 800px;");
		dynamicHTML.h1(d, screen.getPrompt());

	// first line
		var p1 = dynamicHTML.p(d, "padding-left:40px; word-spacing:50px;");
		var i = dynamicHTML.img(p1, "http://icons.iconarchive.com/icons/icons8/ios7/32/Media-Controls-High-Volume-icon.png");
		dynamicHTML.eventHandler2(i, "onclick", function() { dynamicHTML.play (screen.getSound())});
		dynamicHTML.text(p1, 16, " ");
		dynamicHTML.text(p1, 32, screen.getOriginal());

	// second line
		var p2 = dynamicHTML.p(d, "padding-left:20px;");
		var i = dynamicHTML.inputActiveText(p2, "answer", 40, 24, "Type this in English");
		dynamicHTML.eventHandler(i, "onkeydown", "if(event.keyCode == 13) document.getElementById('check').click();");
		dynamicHTML.text(p2, 16, " ");
		
	//This button is used to verify if the input from the user is equal to the translation
		var b1 = dynamicHTML.inpuButton(p2, "check", "Check", "lime");
		dynamicHTML.eventHandler2(b1, "onclick", function() {checkKeyboard(screen.getTranslation())});
		
		dynamicHTML.br(body);
		var d2 = dynamicHTML.div(body, "border:3px solid black; display:block; padding: 5px; text-align: center; height: 15px;width: 100px;");
		dynamicHTML.text(d2, 16, language.getCurrent() + "/" + language.getScreenLength());
		dynamicHTML.hr(body);
	}
	
	/*
	*This static function creates the home screen where you select the lesson you want
	*/
	 static homeScreen() {
		var body = document.body;
	// start with a blank page
		body.innerHTML = '';

		dynamicHTML.h1(body, "Babel   (" + languageName + ")");
		dynamicHTML.br(body);
    
		var d = dynamicHTML.div(body, "border:3px solid black; display:block; padding:15px; height: 200px;width: 800px;");
		dynamicHTML.h1(d, "Lessons");
		dynamicHTML.p(d, "padding-left:40px; word-spacing:50px;");
	
	//This cylcle creates the lessons buttons
		for(var i = 1; i <= language.getNumOfLessons(); i++) {
			var b = dynamicHTML.inpuButton(d, i, "Lesson " + i, "white");
			dynamicHTML.text(d, 50, " ");
			dynamicHTML.eventHandler2(b, "onclick", function() {start(event.target.id)});
		}
		
		if(language.getType() == "extraAlphabet") {
			dynamicHTML.div(d, "border:1px; padding:0.5px; height: 0.5px;width: 700px;");
			for(var i = 1; i <= language.getNumOfSymbols(); i++) {
				var b = dynamicHTML.inpuButton(d, i, "Symbols " + i, "white");
				dynamicHTML.text(d, 50, " ");
				dynamicHTML.eventHandler2(b, "onclick", function() {startSymbol(event.target.id)});
			}
		}
	}

	static runLanguage(text) {
		var table="<tr><th>Title</th><th>Artist</th></tr>";
		xmlDoc = dynamicHTML.text2XML(text);  // assignement to global
		xmlSerializer = new XMLSerializer(); // assignement to global
			// https://www.w3schools.com/xml/dom_nodes_get.asp
		var nodes = xmlDoc.getElementsByTagName("LANGNAME");
		if( nodes.length == 1 ) {
			languageName = nodes[0].childNodes[0].nodeValue;  // assignement to global
			
			var lessons = xmlDoc.getElementsByTagName("LESSON");
			if(languageName == "Japanese") {
				var symbols = xmlDoc.getElementsByTagName("SYMBOLS");
				language = new LanguageExtraAlphabets(lessons, symbols, "extraAlphabet");
			}else
				language = new Language(lessons, "normal");
			startup.homeScreen();
		}
		else {
			alert('ERROR: Not a language file!\nPLEASE, TRY AGAIN!');
			startup.screen0();
		}
	}
}

function onLoad() {
	new startup();
}

//This function selects the screen that is going to be loaded
function start(i) {
	language.startLesson(i);
	var curr = language.getScreen();
	if(curr.type == "keyboard")
		startup.screenKeyboard();
	else if(curr.type == "pairs")
		startup.screenPairs();
	else if(curr.type == "blocks")
		startup.screenBlocks();
}

function startSymbol(i) {
	language.startSymbol(i);
	startup.screenSymbols();
}

//This function selects the next screen that is going to  be loaded 
function next() {
	if(language.hasNextScreen()) {
		var curr = language.getScreen();
		if(curr.type == "keyboard")
			startup.screenKeyboard();
		else if(curr.type == "pairs")
			startup.screenPairs();
		else if(curr.type == "blocks")
			startup.screenBlocks();
	}else
		startup.homeScreen();
}

//This function is used to check the if the answer of the user in the screen keyboard is correct
//if it then the function calls the function next and changes the screen
function checkKeyboard(answer) {
	var value = document.getElementById('answer').value;
	for(var i = 0; i < answer.length;i++) {
		if(value == answer[i]){
			dynamicHTML.validate(document.getElementById('answer').value, answer[i]);
			break;
		}
		if(i == answer.length-1){
			dynamicHTML.validate("answer", "error");
			return 0;	
		}
	}
	next();
}

//this function returns the id of the pair pair1
function searchId(pair1, original) {
	for(var i = 0; i < original.length;i++)
		if(original[i] == pair1)
			return i;
			
	return null;
}

//This function checks if the pair1 and pair2 belong to the same object PairSolution
//if it then the function calls the function next and changes the screen
function definePair(pair1, pair2, id, original, solution) {
	pair2 = document.getElementById(id).value;
	var idP1 = searchId(pair1, original);
	
	if((pair1 && pair2) != null && pair1 != pair2){
		for(var i = 0; i < solution.length;i++) {
			if(pair1 == (solution[i].getMatch() || solution[i].getPair())){
				if(pair2 == (solution[i].getPair() || solution[i].getMatch())){
						document.getElementById(id).disabled = true;
						document.getElementById(idP1).disabled = true;
						dynamicHTML.validate("solution", "solution");
				}
			}else if(pair2 == (solution[i].getMatch() || solution[i].getPair())){
				if(pair1 == (solution[i].getPair() || solution[i].getMatch())){
						document.getElementById(id).disabled = true;
						document.getElementById(idP1).disabled = true;
						dynamicHTML.validate("solution", "solution");
				}
			
			}
		}			
	}
	
	var count = 0;
	for(var j = 0 ; j < original.length; j++) {
		if(document.getElementById(j).disabled == true) {
			count++;
			if(count ==  original.length-1){
				dynamicHTML.validate("solution", "solution");
				next();
				break;
			}
		}
	}
}

//This functions bellow are used to help on the drag and drop implementation
function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function dropOver(ev) {
    ev.preventDefault();
}

//This function is used to check if the block dragged by the user are correct
//the function is attached to the button check in the screen blocks
function checkBlocks (drag, drag2, solution){
	var solutionSplitted = solution.split(" ");
	var div = document.getElementById(drag);
	var div2 = document.getElementById(drag2);
	
	if((div.childNodes.length + div2.childNodes.length) != solutionSplitted.length) {
		dynamicHTML.validate("answer", "error");
		return 0;
	}
	var j = 0;
	for(var i = 0; i < (div.childNodes.length + div2.childNodes.length); i++) {
		if(i < div.childNodes.length)
			var value = (div.childNodes[i].childNodes[0].childNodes[0].nodeValue);
		else
			var value = (div2.childNodes[i-div.childNodes.length].childNodes[0].childNodes[0].nodeValue);
			
		if(value == solutionSplitted[i]){
			j++;
			if(j == solutionSplitted.length) {
				dynamicHTML.validate("solution", "solution");
				next();
				return 0;
			}
		}
		
	}
	
	dynamicHTML.validate("answer", "error");
}

//This function is used to check if the symbols are being dragged to the correct placeholder
function checkSymbols(ev, solution) {
	var data = ev.dataTransfer.getData("text").split(" ")[1];

	if(solution[parseInt(data)-solution.length].getMatch() == solution[parseInt(ev.target.id)].getMatch()){
		ev.preventDefault();
		ev.target.appendChild(document.getElementById("span "+data));
		document.getElementById("div "+data).style.visibility = "hidden";
	}else
		dynamicHTML.validate("answer", "error");
	
	var j = 0;
	for(var i = 0; i < solution.length;i++) {
		var div = document.getElementById("div "+ String(i+solution.length));
		if(div.style.visibility == "hidden") {
			j++;
			if(j == solution.length){
				dynamicHTML.validate("solution", "solution");
				startup.homeScreen();
			}
		}
	}
	
}
