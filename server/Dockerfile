FROM python:latest

WORKDIR /server

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

expose 5000