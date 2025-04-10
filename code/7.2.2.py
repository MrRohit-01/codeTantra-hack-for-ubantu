
def isSelfDescriptive(str_num):
    n = len(str_num)
    
    freq = [0] * 10
    
    for digit in str_num:
        freq[int(digit)] += 1
    
    for i in range(n):
        if freq[i] != int(str_num[i]):
            return 0
    
    return 1

str_num = input().strip()
print(isSelfDescriptive(str_num))