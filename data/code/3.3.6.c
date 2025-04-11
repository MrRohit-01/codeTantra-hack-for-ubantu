#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        int start = i;
        int end = i;
        for (int j = i; j <= 2 * i - 1; j++) {
            printf("%d", j);
            end = j;
        }
        for (int j = end - 1; j >= i; j--) {
            printf("%d", j);
        }
        printf("\n");
    }
    return 0;
}