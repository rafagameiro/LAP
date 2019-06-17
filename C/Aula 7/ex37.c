#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "LinkedList.h"

typedef struct Node {
    Data data;
    List next;
} Node;

static List newNode(Data val, List next)
{
    List n = malloc(sizeof(Node));
    if( n == NULL )
        return NULL;
    n->data = val;
    n->next = next;
    return n;
}

List listMakeRange(Data a, Data b)
{  // TECNICA ESSENCIAL: Ir fazendo crescer a lista no ultimo no'.
    if( a > b )
        return NULL;
    double i;
    List l = newNode(a, NULL), last = l;
    for( i = a + 1 ; i <= b ; i++ )
        last = last->next = newNode(i, NULL);
    return l;
}

/* Outra maneira, mais palavrosa, de escrever a funcao anterior:

List listMakeRange(Data a, Data b)
{
    if( a > b )
        return NULL;
    double i;
    List l = newNode(a, NULL);
    List last = l;
    for( i = a + 1 ; i <= b ; i++ ) {
        List q = newNode(i, NULL);
        last->next = q;
        last = q;
    }
    return l;
}
*/

int listLength(List l) {
    int count;
    for( count = 0 ; l != NULL ; l = l->next, count++ );
    return count;
}

bool listGet(List l, int idx, Data *res)
{
    int i;
    for( i = 0 ; i < idx && l != NULL ; i++, l = l->next );
    if( l == NULL )
        return false;
    else {
        *res = l->data;
        return true;
    }
}

List listPutAtHead(List l, Data val)
{
    return newNode(val, l);
}

List listPutAtEnd(List l, Data val)
{
    if( l == NULL )
        return newNode(val, NULL);
    else {
        List p;
        for( p = l ; p->next != NULL ; p = p->next ); // Stop at the last node
        p->next = newNode(val, NULL);  // Assign to the next of the last node
        return l;
    }
}

List listFilter(List l, BoolFun toKeep)
{  // TECNICA ESSENCIAL: Adicionar um no' auxiliar inicial para permitir tratamento uniforme.
      // Tente fazer sem o no' suplementar e veja como fica muito mais complicado.
    Node dummy;
    dummy.next = l;
    l = &dummy;
    while( l->next != NULL )
        if( toKeep(l->next->data) )
            l = l->next;
        else {
            List del = l->next;
            l->next = l->next->next;
            free(del);
        }
    return dummy.next;
}

void listPrint(List l)
{
    for( ; l != NULL ; l = l->next )
        printf("%lf\n", l->data);
}

static bool isEven(Data data) {
    return (int)data % 2 == 0;
}

static bool isOdd(Data data) {
    return (int)data % 2 != 0;
}

List listClone(list l) {
	
	if(l == NULL)
		return NULL;
		
	List last = newNode (l -> data, NULL);
	List start = last;
	l = l->next;
	
	for ( ; l != NULL ; l = l->next) {
		List n = newNode(l -> data, NULL);
		last->next = n;
		last = n;
	}
	
	return start;
}

List listAppend(List l1, List l2) {
	
	if(l1 == NULL)
		return listClone(l2);
	
	List result = l1;
	for( ; l1->next != NULL ; l1 = l1->next );
	l1-> next = listClone(l2);
	return result;
	
}

List listRev(List l) {
	List res = NULL;
	for( ; l != NULL ; l = l -> next )
		res = newNode(l->data, NULL);
	return res;
}

List listRevInPlace(List l) {
	List previous = l, next;
	for( ; l != NULL ; previous = l, l = next) {
		next = l -> next;
		l -> next = previous;
	}
	return previous;
}

bool listBelongs(Data val, List next) {
		
	for( ; l != NULL ; l = l -> next)
		if( l->data == val) return true;
	return false;	
}

List listUniq(List l) {
	
	Node dummy = (0, l);
	l = &dummy;
	while(l -> next != NULL)
		if(!listBelongs(l->next->data, l->next->next)
			l = l -> next;
		else {
			List del = l->next;
			l->next = l->next->next;
			free(del)
		}
	return dummy.next;
}

void listTest(void) {
    List l = listMakeRange(1.1, 7.8);
    printf("----------\n");
    listPrint(l);
    printf("----------\n");
    l = listFilter(l, isEven);
    listPrint(l);
    printf("----------\n");
    l = listFilter(l, isOdd);
    listPrint(l);
    printf("----------\n");
}
