"""FastAPI application entry point."""

from __future__ import annotations

import os
import traceback
from pathlib import Path

from dotenv import load_dotenv

# Load .env from the project root (3 levels above src/interview_prep_ai/app/main.py)
_ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(_ENV_PATH, override=True)

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from interview_prep_ai.api.codeforces_client import CodeforcesAPIError, CodeforcesClientError
from interview_prep_ai.app.routes import report, coach, solution, ai_providers as ai_providers_route, problems as problems_route
from interview_prep_ai.app.routes.replay import router as replay_router
from interview_prep_ai.services.profile_service import UnsupportedPlatformError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(UnsupportedPlatformError)
    async def unsupported_platform_handler(
        _request: Request,
        exc: UnsupportedPlatformError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(
        _request: Request,
        exc: ValueError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )

    @app.exception_handler(CodeforcesAPIError)
    async def codeforces_api_error_handler(
        _request: Request,
        exc: CodeforcesAPIError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=502,
            content={"detail": str(exc)},
        )

    @app.exception_handler(CodeforcesClientError)
    async def codeforces_client_error_handler(
        _request: Request,
        exc: CodeforcesClientError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=502,
            content={"detail": str(exc)},
        )
        
    @app.exception_handler(Exception)
    async def generic_exception_handler(
        _request: Request,
        exc: Exception,
    ) -> JSONResponse:
        print("=== UNHANDLED EXCEPTION ===")
        print(f"Type: {type(exc).__name__}")
        print(f"Message: {exc}")
        print("Stack trace:")
        traceback.print_exc()
        print("==========================")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "type": type(exc).__name__, "message": str(exc)},
        )

from contextlib import asynccontextmanager
from interview_prep_ai.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await init_db()
    yield
    # Cleanup on shutdown (if any)

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Interview Prep AI",
        description="Generate interview preparation reports from competitive programming profiles.",
        version="0.1.0",
        lifespan=lifespan,
    )


    frontend_url = os.environ.get("FRONTEND_URL", "").strip()
    allow_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    if frontend_url:
        allow_origins.append(frontend_url)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_exception_handlers(app)
    from interview_prep_ai.app.routes import auth
    app.include_router(auth.router)
    app.include_router(report.router)
    app.include_router(coach.router)
    app.include_router(solution.router)
    app.include_router(problems_route.router)
    app.include_router(ai_providers_route.router)
    app.include_router(replay_router)
    return app


app = create_app()
