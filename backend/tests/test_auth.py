from app.models import Admin


def create_first_admin(client, username="network-admin"):
    return client.post(
        "/api/admin/auth/signup",
        json={
            "name": "Network Administrator",
            "username": username,
            "password": "a-very-long-test-password",
        },
    )


def test_signup_creates_first_admin_and_blocks_additional_accounts(client, app):
    response = create_first_admin(client)

    assert response.status_code == 201
    assert response.json["user"]["username"] == "network-admin"
    assert response.json["user"]["role"] == "admin"

    with app.app_context():
        admin = Admin.query.one()
        assert admin.password_hash != "a-very-long-test-password"
        assert admin.check_password("a-very-long-test-password")

    second_response = create_first_admin(client, username="another-admin")
    assert second_response.status_code == 409
    assert "already been created" in second_response.json["message"]


def test_signup_validates_credentials(client):
    response = client.post(
        "/api/admin/auth/signup",
        json={"name": "Admin", "username": "ab", "password": "short"},
    )

    assert response.status_code == 422


def test_login_current_admin_and_csrf_protected_logout(client):
    create_first_admin(client)

    login_response = client.post(
        "/api/admin/auth/login",
        json={
            "username": "network-admin",
            "password": "a-very-long-test-password",
        },
    )
    assert login_response.status_code == 200
    assert login_response.json["user"]["name"] == "Network Administrator"

    current_response = client.get("/api/admin/auth/me")
    assert current_response.status_code == 200
    assert current_response.json["user"]["username"] == "network-admin"

    csrf_token = client.get_cookie("csrf_access_token").value
    logout_response = client.post(
        "/api/admin/auth/logout",
        headers={"X-CSRF-TOKEN": csrf_token},
    )
    assert logout_response.status_code == 200
    assert client.get("/api/admin/auth/me").status_code == 401