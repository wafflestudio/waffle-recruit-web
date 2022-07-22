from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta

User = get_user_model()

class Solver(models.Model):
    class Meta:
        unique_together = (('user', 'prob_num'),)
    prob_num = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    solved_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.user.username)


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prob_num = models.PositiveSmallIntegerField()
    task_id = models.CharField(max_length=36)
    submit_at = models.DateTimeField(auto_now_add=True)


#[XXX] 이거 Refactoring한 Submission이랑 좀 겹치는 것 같은데, user, prob_num 지우고 Submission을 참조하거나 합치는 거 어떨까요?
#[TODO] Model for db logging - 틀린 경우 유저, 문항, 제출시간, 결과물을 저장할 예정
class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prob_num = models.PositiveSmallIntegerField()
    time = models.DateTimeField(auto_now_add=True)
    result = models.TextField()