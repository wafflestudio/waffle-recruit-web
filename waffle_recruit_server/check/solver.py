import subprocess


# from celery import Celery

# app = Celery('tasks', broker='pyamqp://guest:guest@localhost//')


# @app.task
def solve(language, filename, prob_num):
    if int(prob_num) in range(0, 4):
        test_case = open(f"solve/problem{prob_num}/testcase.txt", "r")
        solution = open(f"solve/problem{prob_num}/solution.txt", "r")
    else:
        raise Exception("problem number error")

    if language == "python":
        proc = subprocess.Popen(["python3", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "java":
        proc = subprocess.Popen(["java", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "kotlin":
        compile_proc = subprocess.Popen(["kotlinc", filename, "-include-runtime", "-d", filename[:-3] + ".jar"])
        compile_proc.wait()
        proc = subprocess.Popen(["java", "-jar", filename[:-3] + ".jar"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "js":
        proc = subprocess.Popen(["node", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "ts":
        proc = subprocess.Popen(["ts-node", filename], stdout=subprocess.PIPE, stdin=test_case)
    else:
        raise Exception("language error")
    try:
        outs, errs = proc.communicate(timeout=2)
    except subprocess.TimeoutExpired:
        proc.kill()
        raise Exception("timeout")

    if outs.decode() == solution.read():
        return True
    test_case.close()
    solution.close()
    raise Exception("Wrong answer")
