import hashlib
import json
import os
import boto3
import shutil

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseNotAllowed, HttpResponse, JsonResponse, HttpResponseRedirect
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt, get_token
from datetime import timedelta, datetime, timezone

from check.models import Profile, Solver, Submission, Result
from check.tasks import run_solver
from waffle_recruit_server import settings
from celery.result import AsyncResult

json_filename = "juys8J1swR_solution.json"
response_json_filename = "juys8J1swR_response.json"
saved_indicator = "SAVED_IN_FILE"
submission_due = datetime.fromtimestamp(1629298830, timezone.utc)  # 8/19 00:00:30 KST (UTC+9)


def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        email = req_data['email']
        password = req_data['password']
        major = req_data['major']
        grade = req_data['grade']
        User.objects.create_user(username, email, password)
        user = User.objects.get(username=username)
        hash_value = hashlib.sha256(username.encode()).digest().hex()
        Profile.objects.create(user=user, major=major, grade=grade, credential=hash_value)
        user = authenticate(request, username=username, password=password)
        login(request, user)
        user.save()
        return JsonResponse({"user": user.username}, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            user.save()
            return JsonResponse({"user": user.username}, status=200)
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


def signout(request):
    if request.method == 'GET':
        logout(request)
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['GET'])

# check implemented

def problem(request, prob_num):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method == 'GET':
        already_solved = Solver.objects.filter(
            user=request.user, problem_num=prob_num).exists()
        solved = already_solved
        try:
            submission = Submission.objects.filter(user=request.user, prob_num=prob_num).get()
            task_id = submission.task_id
            if task_id == saved_indicator:
                with open(
                        f"codes/{Profile.objects.get(user=request.user).credential}/{prob_num}/{response_json_filename}") as f:
                    task_result = json.load(f)
            else:
                task = AsyncResult(task_id)
                if task.ready():
                    result = task.result
                    if isinstance(result, Exception):
                        return JsonResponse({'error': repr(result)}, status=500)
                    else:
                        solved, original_prob_num, error = result
                        if original_prob_num != prob_num:
                            return JsonResponse({'error': 'invalid problem number'}, status=500)
                        if not solved:
                            if 'detail' in error:
                                message = f"{error.get('error')}: {error.get('detail')}"
                            else:
                                message = error.get('error')
                            task_result = {
                                'status': 'wrong',
                                'message': message,
                            }
                        else:
                            if not already_solved:
                                # First solve of problem
                                Solver(problem_num=prob_num, user=request.user).save()
                                task_result = {
                                    'status': 'correct',
                                    'message': 'correct',
                                }
                            else:
                                # Already solved problem
                                task_result = {
                                    'status': 'correct',
                                    'message': 'already correct',
                                }
                        with open(
                                f"codes/{Profile.objects.get(user=request.user).credential}/{prob_num}/{response_json_filename}", "w") as f:
                            json.dump(task_result, f)
                        submission.task_id = saved_indicator
                        submission.save()
                        task.forget()
                else:
                    task_result = {
                        'status': 'pending',
                        'message': 'pending',
                    }
        except Submission.DoesNotExist:
            task_result = None
        return JsonResponse({'solved': already_solved or solved, 'task': task_result}, status=200)

    elif request.method == 'POST':
        profile = Profile.objects.get(user=request.user)
        last_visit = profile.last_visit
        credential = profile.credential
        time_now = now()
        # block submission due
        # if time_now >= submission_due:
        #     return JsonResponse({"error": "지원이 마감되어 제출이 불가합니다."}, status=400)
        # block too many request per time
        if last_visit is None or last_visit + timedelta(seconds=10) < time_now:
            profile.last_visit = time_now
            profile.save()
        else:
            time_remain = 10 - int((time_now - last_visit).total_seconds())
            return JsonResponse({"remain": time_remain}, status=402)

        try:
            original_task = Submission.objects.filter(user=request.user, prob_num=prob_num).get()
            _task = AsyncResult(original_task.task_id)
            _task.revoke()
            _task.forget()
        except Submission.DoesNotExist:
            original_task = Submission(user=request.user, prob_num=prob_num)
        # save files
        file_path = f"codes/{credential}/{prob_num}/"

        try:
            shutil.rmtree(file_path)
        except Exception:
            pass
        try:
            os.makedirs(file_path)
        except Exception:
            pass
        req_data = json.loads(request.body.decode())
        files = req_data['files']
        language = req_data['language']
        for file in files:
            if '..' in file['filename']:
                return JsonResponse({"error": "invalid filename: `..` is not allowed"}, status=400)
            
            # [TODO] Replace typescript with cpp
            # (daeyong) 임시방편으로 ts파일을 main.cpp로 강제변환중.
            test_filename = file['filename'].replace("index.ts", "main.cpp") 
            local_file = open(file_path + test_filename, 'w')
            #local_file = open(file_path + file['filename'], 'w')
            local_file.write(file['code'])
            local_file.close()
        with open(file_path + json_filename, 'w') as local_file:
            json.dump(req_data, local_file)
        task: AsyncResult = run_solver.delay(language, file_path, prob_num=prob_num)
        original_task.task_id = task.id
        original_task.save()
        # [TODO] log to sqlite - 틀린 경우에만 기록하도록.
        if (task.get()[0] == False):
            # time_now = now() 
            wrong_result = (str(task.get()[2]['error']) + "/" + str(task.get()[2]['detail'])).replace("Wrong answer : your output:", "")
            # Result.objects.create(user=request.user,prob_num = prob_num,time=time_now ,result = wrong_result)
            Result.objects.create(user=request.user,prob_num = prob_num,result = wrong_result)

        return HttpResponse(status=202)

    else:
        return HttpResponseNotAllowed(['POST', 'GET'])


def prob_solvers(request, prob_num):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method == 'GET':
        count = Solver.objects.all().filter(problem_num=prob_num).count()
        result = {'number': count}
        return JsonResponse(result, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def prob_solution(request, prob_num):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method == 'GET':
        profile = Profile.objects.get(user=request.user)
        file_path = f"codes/{profile.credential}/{prob_num}/"
        try:
            with open(file_path + json_filename) as f:
                req_data = json.load(f)
            return JsonResponse(req_data, status=200)
        except FileNotFoundError:
            return HttpResponse(status=404)
    else:
        return HttpResponseNotAllowed(['GET'])


def skeleton(request, lang):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    else:
        client = boto3.client('s3')
        file_name = 'pr3_skel_{}.tar'.format(lang)
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        url = client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_name, },
            ExpiresIn=600,
        )
        return HttpResponseRedirect(url)


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({"user": request.user.username, "token": request.META["CSRF_COOKIE"]}, status=200)
        return JsonResponse({"token": request.META["CSRF_COOKIE"]}, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])
