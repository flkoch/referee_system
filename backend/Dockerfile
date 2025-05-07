FROM ghcr.io/astral-sh/uv:python3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV ENV_PATH=dev.env

WORKDIR /app

ADD uv.lock .
ADD pyproject.toml .

RUN uv sync --locked

COPY . .

EXPOSE 8000
