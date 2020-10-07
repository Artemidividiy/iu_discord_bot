f = open('log.txt', 'r')
a = [f.readline() for _ in f]
print(a)