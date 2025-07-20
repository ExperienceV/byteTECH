FROM python:3.13.5-slim 

WORKDIR /app

# 1. Copia archivos de instalación
COPY setup.py pyproject.toml requirements.txt ./

# 2. Instala dependencias
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copia el código fuente
COPY src/ ./src/

# 4. Configura PYTHONPATH explícitamente
ENV PYTHONPATH="${PYTHONPATH}:/app/src"

EXPOSE 8000

# 5. Asegúrate de apuntar a la ruta correcta
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]