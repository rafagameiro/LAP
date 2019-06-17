/*
 ============================================================================
 Name        : Main.c
 Author      : Artur Miguel Dias
 Version     :
 Copyright   : DI - FCT/UNL
 Description : LAP 2nd project 2017/2018, Ansi-style
 ============================================================================
 */

// gcc -std=c11 -Wall -Wno-unused -o Main Main.c WCompact.c -lm

#include "WCompact.h"


int findWord(String w)
{
    for( int i = 0 ; i < wordsN ; i++ )
        if( strcmp(words[i].word, w)  == 0 )
            return i;
    return -1; 
}

void writeCount(String w)
{
    int i = findWord(w);
    if( i != -1 )
        printf("\"%s\" = %d\n", words[i].word, words[i].count);
        
}

void writeCountCode(String w)
{
    int i = findWord(w);
    if( i != -1 )
        printf("\"%s\" = %d = \"%s\"\n", words[i].word, words[i].count, words[i].code);
        
}

void test1(void)
{
    String code = "A";
    for( int i = 0 ; i < 1234567 ; i++ ) {
        if( i % 30000 == 0 )
            printf("%s ", code);
        codeNext(code);
    }
    printf("\n");
}

void test2(void)
{
    String s = "lalala";
    processWord("ola");
    for(char c = 'a' ; c <= 'z' ; c++ ) {
        s[5] = c;
        processWord(s);
    }
    processWord("ola");
    writeCount("ola");
    writeCount("lalalx");
    writeCount("lalalz");
}

void test3(void)
{
    processLine("one two two two z z z z");
    writeCount("one");
    writeCount("two");
    writeCount("z");
}

void test4(void)
{
    String s = "lalala";
    processWord("ola");
    for(char c = 'a' ; c <= 'z' ; c++ ) {
        s[5] = c;
        processWord(s);
    }
    processWord("ola");
    processTable();
    writeCountCode("ola");
    writeCountCode("lalalx");
    writeCountCode("lalalz");
}

void test5(void)
{
    String s = "lalala";
    processWord("ola");
    for(char c = 'a' ; c <= 'z' ; c++ ) {
        s[5] = c;
        processWord(s);
    }
    processWord("ola");
    processTable();
    printf("\"%s\"\n", translateWord("ola"));
    printf("\"%s\"\n", translateWord("lalalx"));
    printf("\"%s\"\n", translateWord("lalalz"));
}

void test6(void)
{
    FILE *f;
    String line;
    if( (f = fopen("original.txt", "w")) == NULL )
        return;
    fprintf(f, "one, qqq two=33 two two\n");
    fclose(f);
    compress("original.txt", "comprimido.txt");
    if( (f = fopen("comprimido.txt", "r")) == NULL )
        return;
    while( fgets(line, MAX_STRING, f) != NULL )
        printf("%s", line);    
    fclose(f);
}

void test7(void)
{
    insertCode("A", "ola");
    insertCode("ZXY", "troloro");
    printf("\"%s\"\n", translateCode("A"));
    printf("\"%s\"\n", translateCode("ZXY"));
}

int main(void)
{
    int n;
    scanf("%d", &n);
    switch( n ) {
        case 1: test1(); break;
        case 2: test2(); break;
        case 3: test3(); break;
        case 4: test4(); break;
        case 5: test5(); break;
        case 6: test6(); break;
        case 7: test7(); break;
        default: printf("???\n"); break;
    }
    return 0;
}

