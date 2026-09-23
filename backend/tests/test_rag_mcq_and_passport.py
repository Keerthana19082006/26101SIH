def test_mcq_generation_review_status(client):
    """
    Verifies that AI generated questions start in REVIEW_REQUIRED status
    and do not become active questions without trainer approval.
    """
    resp = client.post("/api/mcqs/generate", json={
        "competency": "Survey Sampling",
        "difficulty": "Intermediate",
        "count": 3
    })
    assert resp.status_code == 200
    mcqs = resp.json()
    assert len(mcqs) == 3
    for m in mcqs:
        assert m["validationStatus"] == "REVIEW_REQUIRED"
        assert len(m["options"]) >= 4

    # Trainer approves first MCQ
    mcq_id = mcqs[0]["id"]
    patch_resp = client.patch(f"/api/mcqs/{mcq_id}/status", json={
        "status": "APPROVED",
        "feedback": "Methodology conforms to NSSTA standards"
    })
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "APPROVED"

def test_digital_passport_aggregation(client):
    resp = client.get("/api/passport/demo-employee-01")
    assert resp.status_code == 200
    passport = resp.json()
    assert "passportNumber" in passport
    assert "verificationHash" in passport
    assert passport["status"] == "ACTIVE_VERIFIED"
    assert "competencyMatrix" in passport

def test_future_role_simulation(client):
    resp = client.post("/api/future-roles/simulate", json={
        "currentReadiness": 65.0,
        "competencyName": "Survey Sampling",
        "currentLevel": 2.0,
        "targetLevel": 4.0
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["projectedReadiness"] > data["baselineReadiness"]
    assert "readinessGain" in data
