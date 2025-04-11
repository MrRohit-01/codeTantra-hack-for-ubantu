#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char p[101], q[101];
    scanf("%s %s", p, q);
    int m = strlen(p);
    int n = strlen(q);
    int dp[m + 1][n + 1];

    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0)
                dp[i][j] = j;
            else if (j == 0)
                dp[i][j] = i;
            else if (p[i - 1] == q[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = 1 + (dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1]);
        }
    }

    printf("%d\n", dp[m][n]);
    return 0;
}