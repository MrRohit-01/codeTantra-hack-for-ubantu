m_count=S.count('m')

o_count=S.count('o')

n_count=S.count('n')

p_count=S.count('p')

if(m_count+o_count)%2==0 and (n_count+p_count)%2==0:
    return 1
else:
    return 0