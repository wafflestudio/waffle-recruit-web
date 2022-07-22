from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    major = models.TextField(null=True)
    grade = models.IntegerField()
    credential = models.TextField()
    last_visit = models.DateTimeField(default=datetime.now() - timedelta(days=30))

    def __str__(self):
        return str(self.id)

class Solver(models.Model):
    problem_num = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user.username)

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prob_num = models.PositiveSmallIntegerField()
    task_id = models.CharField(max_length=36)

#[TODO] Model for db logging - 틀린 경우 유저, 문항, 제출시간, 결과물을 저장할 예정
class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prob_num = models.PositiveSmallIntegerField()
    time = models.DateTimeField(auto_now_add=True)
    result = models.TextField()
    