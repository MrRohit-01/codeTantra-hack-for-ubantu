closed_paths= {
        '0':1, '3':1
,'4':0, '5':1, '6':0, '7': 2, '8':1, '9':0, '1':0, '2':0

    }

    return sum(closed_paths[digit] for digit in str(N))