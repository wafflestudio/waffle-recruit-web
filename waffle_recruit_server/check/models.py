from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta


class Waffle(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    major = models.TextField(null=True)
    grade = models.IntegerField()
    last_visit = models.DateTimeField(
        default=datetime.now()-timedelta(days=30))

    def __str__(self):
        return str(self.id)


class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem_num = models.IntegerField()
    question = models.TextField(null=True)
    answer = models.TextField(null=True)


class Solver(models.Model):
    problem_num = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user.username)
