#include <stdio.h>
#include <stdlib.h>

int main() {
    int nv, k, i, j, temp;

    scanf("%d", &nv);
    int arr[nv];

    for (i = 0; i < nv; i++) {
        scanf("%d", &arr[i]);
    }

    scanf("%d", &k);

    for (i = 0; i < nv - 1; i++) {
        for (j = 0; j < nv - i - 1; j++) {
            if (arr[j] < arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    for (i = 0; i < nv; i++) {
        printf("%d ", arr[i]);
    }
    
    printf("%d", arr[k - 1]);

    return 0;
}