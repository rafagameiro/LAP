/*
 * WCompact.h
 *
 *  Created on: May 3, 2018
 *      Author: amd
 */

#ifndef WCOMPACT_H_
#define WCOMPACT_H_

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>


/* STRINGS */

#define MAX_STRING        256

typedef char String[MAX_STRING];


/* WORD TABLE */

#define MAX_WORDS        10000

typedef struct {
    String word;
    String code;
    int count;
} WordInfo;

extern WordInfo words[MAX_WORDS];
extern int wordsN;


/* LEXICAL TREE */

#define NCHARS        52

typedef struct Node {
    WordInfo *wi;
    struct Node *children[NCHARS];
} Node, *Tree;

extern Tree tree;


/* COMPRESS FUNCTIONS */

void codeNext(String code);
void processWord(String word);
void processLine(String line);
void processTable(void);
char *translateWord(String word);
void compress(String inFilename, String outFilename);

/* DECOMPRESS FUNCTIONS */

void insertCode(String code, String word);
char *translateCode(String code);
void decompress(String inFilename, String outFilename);

#endif
