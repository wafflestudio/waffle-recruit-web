import hashlib
import json
import os

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseNotAllowed, HttpResponse, JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from datetime import timedelta

from check.generate_input import problem1, problem2
from check.models import Profile, Solver
from check.solver import solve

problems = [problem1, problem2]


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
        hash_value = hashlib.sha256(username.encode()).digest().decode()
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
        solved = Solver.objects.filter(
            user=request.user, problem_num=prob_num).exists()
        result = {'solved': solved}

        return JsonResponse(result, status=200)
    elif request.method == 'POST':
        req_data = json.loads(request.body.decode())
        code = req_data['code']
        language = req_data['language']
        profile = Profile.objects.get(pk=request.user.pk)
        last_visit = profile.last_visit
        credential = profile.credential
        time_now = now()
        try:
            os.makedirs(f"codes/{credential}/{prob_num}/")
        except Exception:
            pass
        if language == "java":
            filename = f"codes/{credential}/{prob_num}/Main.java"
        elif language == "kotlin":
            filename = f"codes/{credential}/{prob_num}/main.kt"
        elif language == "js":
            filename = f"codes/{credential}/{prob_num}/main.js"
        elif language == "python":
            filename = f"codes/{credential}/{prob_num}/main.py"
        elif language == "ts":
            filename = f"codes/{credential}/{prob_num}/main.ts"
        else:
            return JsonResponse({"error":"language error"}, status=400)

        # block too many request per time
        if last_visit is None or last_visit + timedelta(seconds=10) < time_now:
            Profile.objects.filter(pk=request.user.pk).update(
                last_visit=time_now)
        else:
            time_remain = 10 - int((time_now - last_visit).total_seconds())
            return JsonResponse({"remain": time_remain}, status=402)

        try:
            solve(language,filename,prob_num)
        except Exception as e:
            return JsonResponse({"error":str(e)}, status=400)

        if not Solver.objects.filter(problem_num=prob_num, user=request.user).exists():
            # First solve of problem
            Solver(problem_num=prob_num, user=request.user).save()
            return HttpResponse(status=200)
        else:
            # Already solved problem
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


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({"user": request.user.username}, status=200)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

# Create your views here.
