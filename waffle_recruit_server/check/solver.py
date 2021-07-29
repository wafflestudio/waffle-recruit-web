import subprocess


# from celery import Celery

# app = Celery('tasks', broker='pyamqp://guest:guest@localhost//')


# @app.task
def solve(language, filename, prob_num):
    if prob_num in range(0, 4):
        test_case = open(f"../solve/problem{prob_num}/testcase.txt", "r")
        solution = open(f"../solve/problem{prob_num}/solution.txt", "r")
    else:
        raise Exception("problem number error")

    if language == "python":
        proc = subprocess.Popen(["python3", f"{filename}.py"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "java":
        proc = subprocess.Popen(["java", f"{filename}.java"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "kotlin":
        compile_proc = subprocess.Popen(["kotlinc", f"{filename}.kt", "-include-runtime", "-d", f"{filename}.jar"])
        compile_proc.wait()
        proc = subprocess.Popen(["java", "-jar", f"{filename}.jar"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "js":
        proc = subprocess.Popen(["node", f"{filename}.js"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "ts":
        proc = subprocess.Popen(["ts-node", f"{filename}.ts"], stdout=subprocess.PIPE, stdin=test_case)
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
