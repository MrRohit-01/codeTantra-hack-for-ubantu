#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

int main() {
    int n, k;
    scanf("%d %d", &n, &k);

    int dp[n + 1][k + 1];
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= k; j++) {
            dp[i][j] = 0;
        }
    }

    for (int j = 1; j <= k; j++) {
        for (int i = 1; i <= n; i++) {
            if (j == 1) {
                dp[i][j] = i;
            } else if (i == 1) {
                dp[i][j] = 1;
            } else {
                int min = INT_MAX;
                for (int x = 1; x <= i; x++) {
                    int temp = 1 + (dp[x - 1][j - 1] > dp[i - x][j] ? dp[x - 1][j - 1] : dp[i - x][j]);
                    if (temp < min) {
                        min = temp;
                    }
                }
                dp[i][j] = min;
            }
        }
    }

    printf("%d\n", dp[n][k]);

    return 0;
}