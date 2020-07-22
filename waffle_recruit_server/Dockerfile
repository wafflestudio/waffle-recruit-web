FROM python:3.6.8
VOLUME /app
WORKDIR /app
COPY requirements.txt .
COPY . .
RUN pip install -r requirements.txt
RUN pip install uwsgi
CMD uwsgi \
 --wsgi-file docker_practice_backend/wsgi.py \
 --http :8000