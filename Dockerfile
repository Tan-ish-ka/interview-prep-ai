FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml README.md ./
COPY src ./src

RUN pip install --no-cache-dir setuptools \
    && pip install --no-cache-dir -e . "uvicorn[standard]>=0.30.0"

EXPOSE 8000

CMD ["uvicorn", "interview_prep_ai.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
