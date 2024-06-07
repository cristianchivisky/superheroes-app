FROM python:3.11.4

WORKDIR /server

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

expose 5000