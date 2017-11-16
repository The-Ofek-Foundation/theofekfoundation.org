def f():
	x = 3
	g([x])

def g(n):
	print(len(n))

if __name__ == '__main__':
	f()
