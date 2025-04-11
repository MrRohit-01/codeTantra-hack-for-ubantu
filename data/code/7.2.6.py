
S = S.lower()

freq = {}

for char in S:
    if char.isalpha():
        freq[char] = freq.get(char, 0) + 1

unique_chars = []

for char in S:
    if char.isalpha() and char not in unique_chars:
        unique_chars.append(char)

result = []

for char in unique_chars:
    result.append(char + ":" + "*" * freq[char])

return ", ".join(result)