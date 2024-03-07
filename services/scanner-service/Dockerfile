FROM hdgigante/python-opencv:4.9.0-ubuntu

WORKDIR /app
COPY . /app

ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR='/var/cache/pypoetry' \
    POETRY_HOME='/usr/local' \
    POETRY_VERSION=1.8.2

RUN apt-get -y install curl && curl -sSL https://install.python-poetry.org | python3 -
RUN rm /usr/lib/python3.11/EXTERNALLY-MANAGED && poetry install --only=main --no-interaction --no-ansi

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-config", "logconfig.yml"]
