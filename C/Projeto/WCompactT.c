/*
 * WCompact.c
 *
 *  Created on: May 3, 2018
 *      Author 1: Pedro Valente (50759)
 *      Author 2: Rafael Gameiro (50677)
 */


#include "WCompact.h"

/* STRINGS */


/* LETTERS */

static char letterFirst(void)
{
    return 'A';
}

static char letterNext(char letter)
{
    if( letter == 'Z' )
        return 'a';
    else if( letter == 'z' )
        return ' ';
    else
        return letter + 1;
}

static int order(char c)
{
    if( 'A' <= c && c <= 'Z' )
        return c - 'A';
    else if( 'a' <= c && c <= 'z' )
        return ('Z'-'A'+1) + c - 'a';
    else
        return -1;
}

static bool isLetter(char c)
{
    return order(c) != -1;
}


/* CODES */

/**
 * resizes the string code, 
 * so that the first position of the string is empty;
 */
void reAlign(String code, int size) {
	String codeN;
	for(int i = 0; i < size; i++)
		codeN[i+1] = code[i];
		
	codeN[size+1] = '\0';
	strcpy(code, codeN);
}

/**
 * using the code in the string, the function calculates the next code;
 */
void codeNext(String code)
{
	int size = strlen(code);
	while(size != 0) {
		char nextLetter = letterNext(code[size-1]);
		if(nextLetter == ' ') {
			if(size-1 == 0) {
				code[size-1] = letterFirst();
				reAlign(code, strlen(code));
			}
			code[size-1] = letterFirst();
		}else {
			code[size-1] = nextLetter;
			break;
		}
		size--;
	}
}


/* WORDS */

WordInfo words[MAX_WORDS];
int wordsN = 0;        /* number of slots filled */


/* LEXICAL TREE */

static Node root = { NULL, {}};
Tree tree = &root;
static int sorted[MAX_WORDS];


/* COMPRESS */

/**
 * checks if a word is already in the array words
 * if it is, increments the number of occurrences
 * otherwise, adds the word to the array and increments 
 * the number of words registed inside the array;
 */
void processWord(String word)
{
	int o;
	int i = 0;
	Node *current = &root;
	
	Node *baby = (Node *) malloc(sizeof(Node));
	
	while(i < strlen(word)){
		if( current->children[order(word[i])] == NULL ){
			o = order(word[i]);
			while(i < strlen(word)){
				if( i == (strlen(word)-1)){
					strcpy(words[wordsN].word, word);
					words[wordsN].count = 1;
					baby->wi = &words[wordsN++];
					current->children[o] = baby;
					i++;
					break;
				}else{
					baby->wi = NULL;
					current = current->children[o];
					current = baby;
					o = order(word[i]);
					i++;
				}
			}
		}else{
			if( i == (strlen(word)-1) ){
				strcpy(words[wordsN].word, word);
				words[wordsN].count++;
				baby->wi = &words[wordsN++];
				current->children[order(word[i])] = baby;
				printf("word: %s\n", word);
			}
			current = current->children[order(word[i++])];
		}
	}
	sorted[wordsN] = wordsN;
	//talvez não seja preciso
	free(baby);
}

/**
 * separates the line into words and
 * process each word individualy
 * if the word is empty it skips to the next one;
 */
void processLine(String line)
{
	int i = 0;
	while(i < strlen(line)) {
		String word;
		int j = 0;
		for(; isLetter(line[i]);j++)
			word[j] = line[i++];	
		word[j] = '\0';
		
		if(strlen(word) != 0)
			processWord(word);	
		i++;
	}	
}

/**
 * compares the number of occurrences between to wordInfo structs
 * if the number of occurences is the same, then
 * compare the structs alphabetically through the variable word;
 */
static int cmpWords(const void *p1, const void *p2) {
	int index1 = *(int*)p1;
	int index2 = *(int*)p2;
	int result = words[index1].count < words[index2].count ? 1 : words[index1].count > words[index2].count? -1 : 0;
	
	if(result == 0)
		return strcmp(words[index1].word, words[index2].word);
	else
		return result;
}

/**
 * reorder the array words using the qsort function,
 * with the cmp as criteria
 * after that it gives each struct with word, a code;
 */
void processTable(void)
{
	qsort(sorted, wordsN, sizeof(int), cmpWords); 
	String code = {letterFirst(), '\0'};
	for(int i = 0; i < wordsN; i++) {
		strcpy(words[sorted[i]].code, code);
		codeNext(code);
	}
		
}

/**
 * Having the word, searches through the array words,
 * and after finding the position, returns the respective code;
 */
char *translateWord(String word)
{
	printf("size: %ld\n", strlen(word));
	int pos;
	Node *current = &root;
	for(int i = 0; i<strlen(word); i++) {
		pos = order(word[i]);
		current = current->children[pos];
		printf("index: %d word: %c\n", i, word[i]);
		if(current->wi != NULL) {
			printf("passou\n");
			printf("word in node: %s\n", current->wi->word);
		}
		//if(i == strlen(word)-1)
			//return current->wi->code;		
	}
		
    return NULL;
}

/**
 * Having the word, searches through the array words,
 * and after finding correspondence, returns the position
 * in the array;
 */
int found(String word) 
{
	for(int i = 0; i < wordsN; i++)
		if(strcmp(words[i].code,word) == 0)
			return i;
			
	return -1;
}

/**
 * separates the line into words and
 * encodes each word individualy to a new line
 * if the word is empty it skips to the next word
 * if its the first time, the word is encoded,
 * a translation is added to the code;
 */
char *translateLine(String line)
{
	int i = 0, k = 0, j;
	String lineT;
	while(i < strlen(line)) {
		String word;
		String oldWord;
		char notLetter = ' ';
		for(j = 0; isLetter(line[i]);j++)
			word[j] = line[i++];
		notLetter = line[i];
		word[j] = '\0';
		if(strlen(word) == 0) {
			lineT[k++] = notLetter;
			i++;
			continue;
		}	
		strcpy(oldWord, word);
		strcpy(word, translateWord(word));
		
		int index = found(word);
		if(words[index].count == 0) {
			String equal = "=";
			strcat(word,strcat(equal,oldWord));
			words[index].count++; 
		}
		
		for(j = 0; j < strlen(word);j++)
			lineT[k++] = word[j];
		
		lineT[k++] = notLetter;
		i++;
	}
	lineT[k] = '\0';
	strcpy(line, lineT);
	return line;
}

/**
 * goes through the array words
 * in each position, sets the variable count to zero;
 */
void emptyCounts()
{
	for(int i = 0; i < wordsN; i++)
		words[i].count = 0;
}

/**
 * Firstly, reads a file and creates a table with the words and codes
 * to every word
 * Secondly, iterates the file again, but this time encodes every line
 * to another file;
 */
void compress(String inFilename, String outFilename)
{
	FILE *fr, *fw;
	char line[MAX_STRING]; 
	
	fr = fopen(inFilename, "r");
	fw = fopen(outFilename, "w");
	
	while( fgets(line, MAX_STRING,fr) != NULL ) {
		line[strlen(line)-1] = '\0';
		processLine(line);
	}
	fclose(fr);
	processTable();
	emptyCounts();
	fr = fopen(inFilename, "r");

	while( fgets(line, MAX_STRING, fr) != NULL ) 
		fputs( translateLine(line), fw);
	
	fclose(fr);
	fclose(fw);
	wordsN = 0;
}


/* DECOMPRESS */

/**
 * checks if a word is already in the array words
 * if it is, increments the number of occurrences
 * otherwise, adds the word and respective code to the array 
 * and increments the number of words registed inside the array;
 */
void insertCode(String code, String word) {
	int i = 0, has = 0;
	for( ; i<wordsN; i++)
		if( strcmp( code, words[i].code ) == 0 ){
			words[i].count++;
			has = 1;
		}
	
	if( has == 0 ){
		strcpy( words[wordsN].word, word );
		strcpy( words[wordsN].code, code );
		words[wordsN].count = 1;
		wordsN ++;
	}
}

/**
 * having a code, searches thorugh the array,
 * and after finding correspondence, return the respective word;
 */
char *translateCode(String code) {
	int i = 0; 
	for( ; i<wordsN; i++)
		if( strcmp( code, words[i].code ) == 0 ){
			return words[i].word;
		}
		
    return NULL;
}

/**
 * separates the line into words and
 * decodes each word individualy to a new line
 * if the word is empty it skips to the next word
 * if its the first time, the word is decoded,
 * the word and respective code are added to the array words;
 */
char *translateLineInv(String line)
{
	int i = 0, k = 0, j;
	String lineT;
	while(i < strlen(line)) {
		String code;
		String word;
		for(j = 0; isLetter(line[i]); j++)
			code[j] = line[i++];
		code[j] = '\0';
		if(strlen(code) == 0) {
			lineT[k++] = line[i];
			i++;
			continue;	
		}	
		if(line[i++] == '=') {
			for(j = 0; isLetter(line[i]);j++)
				word[j] = line[i++];
			word[j] = '\0';
			insertCode(code, word);
			i++;
		}
		strcpy(word, translateCode(code));
		for(j = 0; j < strlen(word);j++)
			lineT[k++] = word[j];
		
		lineT[k++] = line[i-1];
	}
	lineT[k] = '\0';
	strcpy(line, lineT);
	return line;
}

/**
 * Reads a file encoded, and for every line
 * decodes the line and writes it down to another file;
 */
void decompress(String inFilename, String outFilename)
{
	FILE *fr, *fw;
	char line[MAX_STRING]; 
	
	fr = fopen(inFilename, "r");
	fw = fopen(outFilename, "w");
	
	while( fgets(line, MAX_STRING,fr) != NULL )
		fputs( translateLineInv(line), fw);
	
	
	fclose(fr);
	fclose(fw);
	wordsN = 0;
}
