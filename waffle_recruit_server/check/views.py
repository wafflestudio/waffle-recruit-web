import hashlib
import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponseNotAllowed, HttpResponse, JsonResponse
# check implemented
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

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
        year = req_data['year']
        User.objects.create_user(username, email, password)
        user = User.objects.get(username=username)
        hash_byte = hashlib.sha256(username.encode()).digest()
        hash_int = int.from_bytes(hash_byte, byteorder='big') & 0xffffffff
        Waffle.objects.create(user=user, major=major, year=year)
        for index, problem in enumerate(problems):
            random_input, answer = problem(hash_int)
            Answer.objects.create(user=user, problem_num=index + 1, question=random_input, answer=answer)
        user = authenticate(request, username=username, password=password)
        login(request, user)
        user.save()
        return HttpResponse(status=201)
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
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


# check implemented

def grade(request, prob_num):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)
    elif request.method == 'GET':
        ans = Answer.objects.get(user=request.user, problem_num=prob_num)
        result = {'input': ans.question}
        return JsonResponse(result, status=200)
    elif request.method == 'POST':
        ans = Answer.objects.get(user=request.user, problem_num=prob_num)
        req_data = json.loads(request.body.decode())
        answer = req_data['answer']
        if str(answer).lower() == str(ans.answer).lower():
            try:
                Solver.objects.get(problem_num=prob_num, user=request.user)
                return HttpResponse(status=202)
            except Solver.DoesNotExist:
                Solver(problem_num=prob_num, user=request.user).save()
                return HttpResponse(status=200)
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponseNotAllowed(['POST', 'GET'])


def prob_solvers(request, prob_num):
    if request.method == 'GET':
        count = Solver.objects.all().filter(problem_num=prob_num).count()
        result = {'number': count}
        return JsonResponse(result, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return HttpResponse(status=200)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

# Create your views here.
