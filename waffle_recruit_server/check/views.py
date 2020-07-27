import hashlib
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseNotAllowed, HttpResponse, JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from datetime import timedelta

from check.generate_input import problem1, problem2
from check.models import Waffle, Solver, Answer

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
        hash_byte = hashlib.sha256(username.encode()).digest()
        hash_int = int.from_bytes(hash_byte, byteorder='big') & 0xffffffff
        Waffle.objects.create(user=user, major=major, grade=grade)
        for index, problem in enumerate(problems):
            random_input, answer = problem(hash_int)
            Answer.objects.create(
                user=user, problem_num=index + 1, question=random_input, answer=answer)
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


def grade(request, prob_num):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method == 'GET':
        ans = Answer.objects.get(user=request.user, problem_num=prob_num)
        solved = Solver.objects.filter(
            user=request.user, problem_num=prob_num).exists()
        result = {'input': ans.question, 'solved': solved}

        return JsonResponse(result, status=200)

    elif request.method == 'POST':
        ans = Answer.objects.get(user=request.user, problem_num=prob_num)
        req_data = json.loads(request.body.decode())
        answer = req_data['answer']

        last_visit = Waffle.objects.get(pk=request.user.pk).last_visit
        time_now = now()

        # block too many request per time
        if last_visit is None or last_visit + timedelta(seconds=10) < time_now:
            Waffle.objects.filter(pk=request.user.pk).update(
                last_visit=time_now)
        else:
            time_remain = 10 - int((time_now - last_visit).total_seconds())
            return JsonResponse({"remain": time_remain}, status=402)

        if str(answer).lower() == str(ans.answer).lower():

            if not Solver.objects.filter(problem_num=prob_num, user=request.user).exists():
                # First solve of problem
                Solver(problem_num=prob_num, user=request.user).save()
                return HttpResponse(status=200)
            else:
                # Already solved problem
                return HttpResponse(status=202)

        else:
            return HttpResponse(status=400)

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
