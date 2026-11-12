import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Admin

auth_bp = Blueprint("admin_auth", __name__)
USERNAME_PATTERN = re.compile(r"^[a-zA-Z0-9._-]{3,64}$")
POSTGRES_REGISTRATION_LOCK = 7_318_249_102


def _admin_response(admin):
    return jsonify({"user": admin.to_public_dict()})


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "A JSON request body is required."}), 400

    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    if not all(isinstance(value, str) for value in (name, username, password)):
        return jsonify({"message": "Complete all required fields."}), 422

    name = name.strip()
    username = username.strip().lower()
    if not 1 <= len(name) <= 100:
        return jsonify({"message": "Enter a name between 1 and 100 characters."}), 422
    if not USERNAME_PATTERN.fullmatch(username):
        return jsonify(
            {"message": "Username must be 3-64 letters, numbers, dots, dashes, or underscores."}
        ), 422
    if not 12 <= len(password) <= 128:
        return jsonify({"message": "Password must be between 12 and 128 characters."}), 422

    if db.engine.dialect.name == "postgresql":
        db.session.execute(
            text("SELECT pg_advisory_xact_lock(:lock_key)"),
            {"lock_key": POSTGRES_REGISTRATION_LOCK},
        )

    if Admin.query.first() is not None:
        db.session.rollback()
        return jsonify(
            {"message": "An administrator account has already been created."}
        ), 409

    admin = Admin(name=name, username=username)
    admin.set_password(password)
    db.session.add(admin)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        if Admin.query.first() is not None:
            return jsonify(
                {"message": "An administrator account has already been created."}
            ), 409
        raise

    return jsonify(
        {
            "message": "Administrator account created. Sign in to continue.",
            "user": admin.to_public_dict(),
        }
    ), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "A JSON request body is required."}), 400

    username = data.get("username")
    password = data.get("password")
    if not isinstance(username, str) or not isinstance(password, str):
        return jsonify({"message": "Enter your username and password."}), 422

    admin = Admin.query.filter_by(username=username.strip().lower()).first()
    if admin is None or not admin.check_password(password):
        return jsonify({"message": "Invalid username or password."}), 401

    response = _admin_response(admin)
    token = create_access_token(identity=str(admin.id))
    set_access_cookies(response, token)
    return response


@auth_bp.get("/me")
@jwt_required()
def current_admin():
    admin = db.session.get(Admin, int(get_jwt_identity()))
    if admin is None:
        return jsonify({"message": "Administrator account not found."}), 401
    return _admin_response(admin)


@auth_bp.post("/logout")
@jwt_required()
def logout():
    response = jsonify({"success": True})
    unset_jwt_cookies(response)
    return response