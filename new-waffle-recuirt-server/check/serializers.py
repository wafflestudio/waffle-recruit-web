from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .models import Solver, Submission, Result
from .tasks import run_solver
from datetime import datetime, timedelta, timezone
from celery.result import AsyncResult
import shutil
import os
import hashlib
import json
import boto3
from django.conf import settings

json_filename = "juys8J1swR_solution.json"
response_json_filename = "juys8J1swR_response.json"
saved_indicator = "SAVED_IN_FILE"
submission_due = datetime.strptime("2022-07-30 00:00:00", "%Y-%m-%d %H:%M:%S")  # 8/19 00:00:30 KST (UTC+9)

LANGUAGE_CHOICES = (
    ('c++', 'c++'),
    ('python', 'python'),
    ('java', 'java'),
    ('javascript', 'javascript'),
    ('kotlin', 'kotlin'),
)

class SubmissionService(serializers.Serializer):
    req_data = serializers.JSONField(required=True)
    prob_num = serializers.IntegerField(required=True)

    def validate(self, data):
        user = self.context['request'].user
        prob_num = data['prob_num']
        if Solver.objects.filter(user=user, problem_num=prob_num).exists():
            raise serializers.ValidationError("이미 맞춘 문제입니다.")

        if datetime.now() > submission_due:
            raise serializers.ValidationError("제출기간이 지났습니다.")

        last_submit = Submission.objects.filter(user=user).order_by('-submit_at').first()
        if last_submit is not None:
            if last_submit.submit_at + timedelta(seconds=10) > datetime.now():
                time_remain = timedelta(seconds=10) - (datetime.now() - last_submit.submit_at)
                raise AuthenticationFailed({
                    "remain": int(time_remain.total_seconds())
                })
        self.context['last_submit'] = last_submit
        return data
    
    def execute(self):
        validated_data = self.validated_data
        user = self.context['request'].user
        prob_num = validated_data['prob_num']
        req_data = validated_data['req_data']
        credential = user.credential
        last_submit = self.context.get('last_submit', None)
        if last_submit is not None:
            _task = AsyncResult(last_submit.task_id)
            _task.revoke()
            _task.forget()
        file_path = f"codes/{credential}/{prob_num}/"
        
        try:
            shutil.rmtree(file_path)
        except Exception:
            pass
        try:
            os.makedirs(file_path)
        except Exception:
            pass

        files = req_data['files']
        language = req_data['language']
        for file in files:
            if '..' in file['filename']:
                return Response({"error": "invalid filename: `..` is not allowed"}, status=400)
            
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
        Submission.objects.create(user=user, task_id=task.id, prob_num=prob_num)
        # [TODO] log to sqlite - 틀린 경우에만 기록하도록.
        if (task.get()[0] == False):
            # time_now = now() 
            wrong_result = (str(task.get()[2]['error']) + "/" + str(task.get()[2]['detail'])).replace("Wrong answer : your output:", "")
            # Result.objects.create(user=request.user,prob_num = prob_num,time=time_now ,result = wrong_result)
            Result.objects.create(user=user,prob_num = prob_num,result = wrong_result)
        return Response("제출이 완료되었습니다.", status=201)


class SkeletonService(serializers.Serializer):
    lang = serializers.ChoiceField(choices=LANGUAGE_CHOICES, required=True)

    def validate(self, data):
        return data

    def execute(self):
        lang = self.validated_data['lang']
        client = boto3.client('s3')
        file_name = 'pr3_skel_{}.tar'.format(lang)
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        url = client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_name, },
            ExpiresIn=600,
        )
        return Response({"url": url}, status=200)