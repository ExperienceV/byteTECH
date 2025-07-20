from setuptools import setup, find_packages

setup(
    name="bttech-backend",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi",
        "uvicorn",
        # Otras dependencias (coincide con requirements.txt)
    ],
)