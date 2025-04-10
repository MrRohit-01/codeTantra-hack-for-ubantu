def SumZero(Marks):
    count = 0
    prefix_sum = 0
    seen_sums = {0: 1}
    
    for mark in Marks:
        prefix_sum += mark
        
        if prefix_sum in seen_sums:
            count += seen_sums[prefix_sum]
        
        seen_sums[prefix_sum] = seen_sums.get(prefix_sum, 0) + 1
    
    return count

# Example usage
Marks = [1, -1, 1, -1, 2, 3, -3]
print(SumZero(Marks))