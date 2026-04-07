import sys
import os

print("Current Working Directory:", os.getcwd())
print("Python Path:", sys.path)
try:
    import api
    print("Found api module:", api)
    print("api module file:", api.__file__)
except ImportError as e:
    print("ImportError:", e)
