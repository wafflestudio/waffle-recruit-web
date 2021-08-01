import subprocess


# from celery import Celery

# app = Celery('tasks', broker='pyamqp://')


# @app.task
def solve(language, file_path, filename, prob_num):
    if int(prob_num) in range(0, 4):
        test_case = open(f"solve/problem{prob_num}/testcase.txt", "r")
        solution_file = open(f"solve/problem{prob_num}/solution.txt", "r")
    else:
        raise Exception("problem number error")

    if language == "python":
        proc = subprocess.Popen(["python3", file_path+filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "java":
        compile_proc = subprocess.Popen(["javac", file_path+"*.java", "-d", file_path])
        compile_proc.wait()
        proc = subprocess.Popen(["java", file_path+filename[:-5]], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "kotlin":
        compile_proc = subprocess.Popen(["kotlinc", file_path+"*.kt", "-include-runtime", "-d", file_path+filename[:-3] + ".jar"])
        compile_proc.wait()
        proc = subprocess.Popen(["java", "-jar", filename[:-3] + ".jar"], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "js":
        proc = subprocess.Popen(["node", file_path+filename], stdout=subprocess.PIPE, stdin=test_case)
    elif language == "ts":
        proc = subprocess.Popen(["ts-node", file_path+filename], stdout=subprocess.PIPE, stdin=test_case)
    else:
        raise Exception("language error")
    try:
        outs, errs = proc.communicate(timeout=2)
    except subprocess.TimeoutExpired:
        proc.kill()
        raise Exception("timeout")

    solution = solution_file.read()
    test_case.close()
    solution_file.close()
    if outs.decode() == solution:
        return True
    raise Exception("Wrong answer")
