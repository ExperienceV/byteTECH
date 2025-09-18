FROM python:3.13.5-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar git y dependencias del sistema + ffmpeg + libmagic
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    build-essential \
    ffmpeg \
    libmagic1 \
    file \
  && rm -rf /var/lib/apt/lists/*

# Copiar dependencias
COPY requirements.txt pyproject.toml setup.py ./

# Declarar ARG para el token
ARG GITHUB_TOKEN

# Instalar pip y dependencias
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir "git+https://ExperienceV:${GITHUB_TOKEN}@github.com/ExperienceV/byteTECH.git@405f17aa7718bd98bfe3264e61e71e4a31207fde#egg=bttech_backend&subdirectory=backend" \
    && pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY src/ ./src/

# Variables de entorno
ENV PYTHONPATH="/app/src:${PYTHONPATH}" \
    UVICORN_HOST=0.0.0.0 \
    UVICORN_PORT=8000 \
    UVICORN_RELOAD=false \
    UVICORN_WORKERS=3 

EXPOSE 8000

# Crear usuario no root Y directorio con permisos
RUN useradd -ms /bin/bash appuser && \
    mkdir -p /app/uploads && \
    chown -R appuser:appuser /app

USER appuser

# Ejecutar Uvicorn con workers
CMD ["bash", "-lc", "python -m uvicorn app.main:app --host ${UVICORN_HOST} --port ${UVICORN_PORT} --workers ${UVICORN_WORKERS} $( [ \"$UVICORN_RELOAD\" = \"true\" ] && echo --reload )"]