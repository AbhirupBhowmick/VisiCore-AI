FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Set default port environment variable
ENV PORT=8000

EXPOSE 8000

# Start python background worker
CMD ["python", "worker.py"]
