import subprocess

# from celery import Celery

# app = Celery('tasks', broker='pyamqp://guest:guest@localhost//')


# @app.task
def run(language, filename, prob_num):
    if prob_num in range(0,4):
        test_case = open(f"../solve/problem{prob_num}/testcase.txt", "r")
        solution = open(f'../solve/problem{prob_num}/solution.txt', "r")
    else:
        raise Exception("problem number error")

    if language == "python":
        proc = subprocess.Popen(["python3", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "java":
        proc = subprocess.Popen(["java", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "kotlin":
        # FIXME
        proc = subprocess.Popen(["cat", filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "nodejs":
        proc = subprocess.Popen(["node", filename], stdout=subprocess.PIPE, stdin=test_case)
    else:
        raise Exception("language error")
    try:
        outs, errs = proc.communicate(timeout=2)
    except subprocess.TimeoutExpired:
        proc.kill()
        raise Exception("timeout")

    if outs.decode() == solution.read():
        return "!!"
    test_case.close()
    solution.close()
    raise Exception("Wrong answer")


if __name__ == '__main__':
    run("python", "../example/pr1.py", 1)
    run("java", "../example/Main.java", 0)
    run("nodejs", "../example/example.js", 0)
