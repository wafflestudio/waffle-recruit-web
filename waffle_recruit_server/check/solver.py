import os
import subprocess


# from celery import Celery

# app = Celery('tasks', broker='pyamqp://')

class RuntimeError(Exception):
    pass


class CompileError(Exception):
    pass


# @app.task
def solve(language, file_path, prob_num):
    if int(prob_num) in range(0, 4):
        solutions = os.listdir(f"solve/problem{prob_num}/solutions")
        testcases = os.listdir(f"solve/problem{prob_num}/testcases")
        solutions.sort()
        testcases.sort()
    else:
        raise Exception("problem number error")

    if language == "java":
        compile_proc = subprocess.Popen(f"javac {file_path}*.java -d {file_path}", shell=True, stderr=subprocess.PIPE)
        compile_proc.wait()
        outs, errs = compile_proc.communicate()
        if errs:
            raise CompileError(errs.decode())
    elif language == "kotlin":
        compile_proc = subprocess.Popen(f"kotlinc {file_path}*.kt -include-runtime -d {file_path}main.jar", shell=True, stderr=subprocess.PIPE)
        compile_proc.wait()
        outs, errs = compile_proc.communicate()
        if errs:
            raise Exception("compile error")

    for test_case_filename, solution_filename in zip(testcases,solutions):
        test_case = open(f"solve/problem{prob_num}/testcases/{test_case_filename}", "r")
        solution_file = open(f"solve/problem{prob_num}/solutions/{solution_filename}", "r")

        if language == "python":
            proc = subprocess.Popen(["python3", file_path + 'main.py'], stdout=subprocess.PIPE, stdin=test_case)
        elif language == "java":
            proc = subprocess.Popen(["java", "-cp", file_path, "Main"], stdout=subprocess.PIPE, stdin=test_case)
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
            if errs:
                raise RuntimeError(errs.decode())
        except subprocess.TimeoutExpired:
            proc.kill()
            raise Exception("timeout")
        except Exception:
            proc.kill()
            raise Exception("Server error")

        test = test_case.read()
        solution = solution_file.read()
        test_case.close()
        solution_file.close()
        if outs.decode() != solution:
            raise Exception("Wrong answer : resulted {a} in {b}".format(a=outs, b=test))
    return True
