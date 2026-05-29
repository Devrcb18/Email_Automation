FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir --retries 10 --default-timeout 100 \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]