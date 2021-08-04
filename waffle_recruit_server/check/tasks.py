from waffle_recruit_server.celery import app
from .solver import solve
from .solver import RuntimeError, CompileError


@app.task(name='solver')
def run_solver(language, file_path, prob_num):
    try:
        solve(language, file_path, prob_num)
        return True, {}
    except RuntimeError as e:
        return False, {"error": "Runtime error", "detail": str(e)}
    except CompileError as e:
        return False, {"error": "Compile error", "detail": str(e)}
    except Exception as e:
        return False, {"error": str(e)}
