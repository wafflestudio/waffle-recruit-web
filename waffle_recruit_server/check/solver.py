import os
import subprocess


# from celery import Celery

# app = Celery('tasks', broker='pyamqp://')


# @app.task
def solve(language, file_path,  prob_num):
    if int(prob_num) in range(0, 4):
        solutions = os.listdir(f"solve/problem{prob_num}/solutions")
        testcases = os.listdir(f"solve/problem{prob_num}/testcases")
    else:
        raise Exception("problem number error")

    try:
        if language == "java":
            compile_proc = subprocess.Popen(f"javac {file_path}*.java -d {file_path}", shell=True)
            compile_proc.wait()
        elif language == "kotlin":
            compile_proc = subprocess.Popen(f"kotlinc {file_path}*.kt -include-runtime -d {file_path}main.jar", shell=True)
            compile_proc.wait()
    except Exception:
        raise Exception("Compile Error")

    for test_case_filename, solution_filename in zip(testcases,solutions):
        test_case = open(f"solve/problem{prob_num}/testcases/{test_case_filename}", "r")
        solution_file = open(f"solve/problem{prob_num}/solutions/{solution_filename}", "r")

        if language == "python":
            proc = subprocess.Popen(["python3", file_path + 'main.py'], stdout=subprocess.PIPE, stdin=test_case)
        elif language == "java":
            proc = subprocess.Popen(["java", file_path + "Main"], stdout=subprocess.PIPE, stdin=test_case)
        elif language == "kotlin":
            proc = subprocess.Popen(["java", "-jar", file_path + "main.jar"], stdout=subprocess.PIPE,
                                    stdin=test_case)
        elif language == "javascript":
            proc = subprocess.Popen(["babel-node", file_path], stdout=subprocess.PIPE, stdin=test_case)
        elif language == "typescript":
            proc = subprocess.Popen(["ts-node", file_path], stdout=subprocess.PIPE, stdin=test_case)
        else:
            raise Exception("language error")
        try:
            outs, errs = proc.communicate(timeout=1)
        except subprocess.TimeoutExpired:
            proc.kill()
            raise Exception("timeout")

        solution = solution_file.read()
        test_case.close()
        solution_file.close()
        if outs.decode() != solution:
            raise Exception("Wrong answer")
    return True
