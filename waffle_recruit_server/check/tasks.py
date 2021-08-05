from waffle_recruit_server.celery import app
from .solver import solve
from .solver import RuntimeError, CompileError


@app.task(name='solver')
def run_solver(language, file_path, prob_num):
    try:
        solve(language, file_path, prob_num)
        return True, prob_num, {}
    except RuntimeError as e:
        return False, prob_num, {"error": "Runtime error", "detail": str(e).replace(file_path, "submission/")}
    except CompileError as e:
        return False, prob_num, {"error": "Compile error", "detail": str(e).replace(file_path, "submission/")}
    except Exception as e:
        return False, prob_num, {"error": str(e).replace(file_path, "submission/")}
