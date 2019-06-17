#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <time.h>

#define N_ELEMS  30

void fill(int vect[], int n) {
    // FAZER
}

void sort(int vect[], int n) {
    // FAZER
}

void show(int vect[], int n) {
    int i;
    printf("----------------\n");
    for( i = 0 ; i < n ; i++ )
        printf("%12d\n", vect[i]);
    printf("----------------\n");
}

int main() {
    int vect[N_ELEMS];
    fill(vect, N_ELEMS);
    show(vect, N_ELEMS);
    sort(vect, N_ELEMS);
    show(vect, N_ELEMS);
    return 0 ;
}
