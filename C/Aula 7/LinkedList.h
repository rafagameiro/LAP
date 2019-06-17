#ifndef _LinkedList_
#define _LinkedList_

#include <stdbool.h>

typedef double Data;
typedef struct Node *List; // so' mudou isto

typedef bool BoolFun(Data);

List listMakeRange(Data a, Data b);
int listLength(List l);
bool listGet(List l, int idx, Data *res);
List listPutAtHead(List l, Data val);
List listPutAtEnd(List l, Data val);
void listPrint(List l);
List listFilter(List l, BoolFun toKeep);
void listTest(void);
#endif
