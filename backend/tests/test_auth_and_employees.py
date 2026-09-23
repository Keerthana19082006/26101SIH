def test_login_success(client):
    resp = client.post("/api/auth/login", json={
        "email": "employee01@karmasiksha.gov.in",
        "password": "KarmaSiksha@2026"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["role"] == "EMPLOYEE"

def test_get_demo_employees(client):
    resp = client.get("/api/employees/demo")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 5
    emp1 = next((e for e in data if e["id"] == "demo-employee-01"), None)
    assert emp1 is not None
    assert "MoSPI" in emp1["department"]

def test_get_employee_dashboard(client):
    resp = client.get("/api/employees/demo-employee-01/dashboard")
    assert resp.status_code == 200
    data = resp.json()
    assert "employee" in data
    assert "competencyRadar" in data
    assert "nextBestAction" in data
