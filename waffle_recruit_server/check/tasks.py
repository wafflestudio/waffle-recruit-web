from waffle_recruit_server.celery import app
from .solver import solve
from .solver import RuntimeError, CompileError, TimeoutError
from pathlib import Path

root_path = str(Path(__file__).parent.parent.resolve())


@app.task(name='solver')
def run_solver(language, file_path, prob_num):
    try:
        solve(language, file_path, prob_num)
        return True, prob_num, {}
    except RuntimeError as e:
        return False, prob_num, {"error": "런타임 에러", "detail": str(e).replace(root_path, "").replace(file_path, "submission/")}
    except CompileError as e:
        return False, prob_num, {"error": "컴파일 에러", "detail": str(e).replace(root_path, "").replace(file_path, "submission/")}
    except TimeoutError as e:
        return False, prob_num, {"error": "시간 초과", "detail": str(e).replace(root_path, "").replace(file_path, "submission/")}
    except Exception as e:
        return False, prob_num, {"error": "정답과 다른 결과", "detail": str(e).replace(root_path, "").replace(file_path, "submission/")}
