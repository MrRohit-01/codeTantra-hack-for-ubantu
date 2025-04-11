#include <stdio.h>
#include <stdlib.h>

int isExtraordinary(int n) {
    if (n <= 0) return 0;
    while (n % 2 == 0) n /= 2;
    while (n % 3 == 0) n /= 3;
    while (n % 5 == 0) n /= 5;
    return (n == 1);
}

int findNthExtraordinary(int n) {
    int count = 0;
    int i = 1;
    while (count < n) {
        if (isExtraordinary(i)) {
            count++;
        }
        i++;
    }
    return i - 1;
}

int main() {
    int t;
    scanf("%d", &t);
    int arr[t];
    for (int i = 0; i < t; i++) {
        scanf("%d", &arr[i]);
    }
    for (int i = 0; i < t; i++) {
        printf("%d", findNthExtraordinary(arr[i]));
        if(i < t - 1){
            printf(" ");
        }
    }
    printf("\n");
    return 0;
}