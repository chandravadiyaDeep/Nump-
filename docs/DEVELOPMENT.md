# Development Guide — Initial

## Prerequisites

- Git
- Python 3.12 recommended for the initial backend
- Node.js LTS for the web application when its stack is selected

## Backend setup (planned)

From the repository root in PowerShell:

```powershell
# Create and activate the Python environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies after apps/api/requirements.txt is created
python -m pip install --upgrade pip
```

Run checks and tests before considering a stage complete. Commands above establish the environment only; the API implementation and dependency file are added in the next development stage.

## Configuration and secrets

- Copy `.env.example` to an ignored local environment file when required.
- Never commit API keys, Supabase secrets, passwords, or real user data.
- Keep example environment values as placeholders.

## Definition of done per feature

- Tests cover normal input, empty input, invalid input and meaningful edge cases.
- Errors are understandable and do not leak sensitive server information.
- No data corruption or silent destructive change.
- Documentation reflects actual supported behaviour.
- End-to-end path has been tested with a small fixture dataset.
