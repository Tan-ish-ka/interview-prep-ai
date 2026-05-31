"""FastAPI application entry point."""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from interview_prep_ai.api.codeforces_client import CodeforcesAPIError, CodeforcesClientError
from interview_prep_ai.app.routes import report
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

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Interview Prep AI",
        description="Generate interview preparation reports from competitive programming profiles.",
        version="0.1.0",
    )
    register_exception_handlers(app)
    app.include_router(report.router)
    return app


app = create_app()
