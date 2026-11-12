from pathlib import Path

from flask import Flask

from app.config import Config
from app.extensions import db, jwt


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/admin/auth")

    with app.app_context():
        db.create_all()

    return app