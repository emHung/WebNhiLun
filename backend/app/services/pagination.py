"""Shared response contract for bounded list endpoints."""


def page_result(rows, total: int, page: int, limit: int, **extra):
    return {
        "items": [dict(row) for row in rows],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": max(1, (total + limit - 1) // limit),
        **extra,
    }
