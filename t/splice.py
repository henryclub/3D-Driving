import sys
p='/tmp/forks/landmarks/index.html'
s=open(p).read()
parts=[open('/tmp/forks/landmarks/t/'+f).read() for f in sys.argv[1:]]
a=s.index("  // <LANDMARKS2>\n")+len("  // <LANDMARKS2>\n")
b=s.index("  // </LANDMARKS2>")
s=s[:a]+''.join(parts)+s[b:]
open(p,'w').write(s)
print('ok',len(s))
