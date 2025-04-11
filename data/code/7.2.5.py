def findPairs(A, k):
    if k < 0:
        return 0
        
    freq = {}
    count = 0
    
    for num in A:
        freq[num] = freq.get(num, 0) + 1
    
    if k == 0:
        count = sum(1 for num in freq if freq[num] > 1)
    else:
        count = sum(1 for num in freq if num + k in freq)
    
    return count

n = int(input().strip())
A = list(map(int, input().split()))
k = int(input().strip())
print(findPairs(A, k))