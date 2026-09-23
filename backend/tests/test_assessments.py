def test_enter_employee_creates_new_attempt_every_time(client):
    """
    CRITICAL SIH 26101 RULE TEST:
    Every click of 'Enter Employee' MUST create a brand new attempt record,
    without being blocked by any previous attempts or completions.
    """
    # Attempt 1
    resp1 = client.post("/api/assessments/start-diagnostic", json={"employeeId": "demo-employee-01"})
    assert resp1.status_code == 200
    data1 = resp1.json()
    attempt1_id = data1["attemptId"]
    assert attempt1_id.startswith("asmt-demo-employee-01")
    assert len(data1["questions"]) > 0

    # Attempt 2
    resp2 = client.post("/api/assessments/start-diagnostic", json={"employeeId": "demo-employee-01"})
    assert resp2.status_code == 200
    data2 = resp2.json()
    attempt2_id = data2["attemptId"]

    # Verify attempt IDs are distinct and independent
    assert attempt1_id != attempt2_id
    assert data2["attemptIndex"] > data1["attemptIndex"]

def test_adaptive_answer_progression(client):
    """
    Tests answering a question and receiving an adaptive response.
    """
    resp = client.post("/api/assessments/start-diagnostic", json={"employeeId": "demo-employee-01"})
    data = resp.json()
    attempt_id = data["attemptId"]
    q1 = data["questions"][0]

    # Submit an answer
    ans_resp = client.post(
        f"/api/assessments/{attempt_id}/answer",
        json={
            "questionId": q1["id"],
            "selectedOptionId": q1["options"][0]["id"],
            "responseTimeSeconds": 15
        }
    )
    assert ans_resp.status_code == 200
    ans_data = ans_resp.json()
    assert "answeredCorrect" in ans_data
    assert "questionsRemaining" in ans_data

def test_submit_completed_assessment_updates_competencies(client):
    """
    Tests submitting all answers, verifying scoring, skill gap calculation,
    and closed-loop recommendation output.
    """
    resp = client.post("/api/assessments/start-diagnostic", json={"employeeId": "demo-employee-01"})
    data = resp.json()
    attempt_id = data["attemptId"]
    
    answers = {}
    for q in data["questions"]:
        answers[q["id"]] = q["options"][0]["id"]

    submit_resp = client.post(
        f"/api/assessments/{attempt_id}/submit",
        json={"answers": answers}
    )
    assert submit_resp.status_code == 200
    res_data = submit_resp.json()

    assert res_data["attemptId"] == attempt_id
    assert "overallScore" in res_data
    assert "competencyScores" in res_data
    assert "criticalGaps" in res_data
    assert "recommendedCourses" in res_data
    assert len(res_data["recommendedCourses"]) > 0
