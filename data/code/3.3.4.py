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
    int T;
    scanf("%d", &T);
    int arr[T];
    for (int i = 0; i < T; i++) {
        scanf("%d", &arr[i]);
    }
    for (int i = 0; i < T; i++) {
        printf("%d\n", findNthExtraordinary(arr[i]));
    }
    return 0;
}