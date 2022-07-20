from solve import solve
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TC_DIR = os.path.join(BASE_DIR, "testcases")
SOL_DIR = os.path.join(BASE_DIR, "solutions")

tc_cnt = len(os.listdir(TC_DIR))
for i in range(tc_cnt):
    tc = open(TC_DIR + "/%s" % i)
    sol = open(SOL_DIR + "/%s" % i)
    line_cnt = int(tc.readline())
    for j in range(line_cnt):
        line = list(map(int, tc.readline().split()))
        res = str(solve(*line))
        ans = sol.readline().strip()
        if res != ans:
            print("WRONG")
            exit()
print("CORRECT")