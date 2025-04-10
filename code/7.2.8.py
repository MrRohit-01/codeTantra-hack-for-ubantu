def has_unique_digits(num):
    return len(set(str(num))) == len(str(num))

def sum_unique_digits(Left, Right):
    return sum([num for num in range(Left, Right + 1) if has_unique_digits(num)])