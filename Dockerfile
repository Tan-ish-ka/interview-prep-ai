FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (required for compiling packages like bcrypt/asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install all production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the actual application source code
COPY src/ ./src/

# Tell Python where to find the 'interview_prep_ai' module
ENV PYTHONPATH=/app/src

# Expose the standard FastAPI port
EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "interview_prep_ai.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
