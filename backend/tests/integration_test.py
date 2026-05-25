import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from database import Base, engine

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["db"] == "connected"
    print("[PASS] GET /health")

def test_create_enquiry_booking():
    r = client.post("/enquiry", json={
        "customer_name": "Raj Patel",
        "channel": "email",
        "message": "I would like to book an appointment next week"
    })
    assert r.status_code == 201
    data = r.json()
    assert "job_id" in data
    assert data["status"] == "new"
    print(f"[PASS] POST /enquiry (booking) -> job_id={data['job_id']}")
    return data["job_id"]

def test_create_enquiry_pricing():
    r = client.post("/enquiry", json={
        "customer_name": "Sarah M.",
        "channel": "whatsapp",
        "message": "What is the price of your premium plan?"
    })
    assert r.status_code == 201
    print("[PASS] POST /enquiry (pricing)")
    return r.json()["job_id"]

def test_create_enquiry_no_sop():
    r = client.post("/enquiry", json={
        "customer_name": "James L.",
        "channel": "call",
        "message": "Just calling to say hello"
    })
    assert r.status_code == 201
    print("[PASS] POST /enquiry (no SOP match -> escalate)")
    return r.json()["job_id"]

def test_validation_error():
    r = client.post("/enquiry", json={"customer_name": "", "channel": "fax", "message": ""})
    assert r.status_code == 422
    print("[PASS] POST /enquiry (validation error 422)")

def test_follow_up(enquiry_id: str):
    r = client.post(f"/enquiry/{enquiry_id}/follow-up", json={
        "delay_minutes": 30,
        "message_template": "Hi, following up on your enquiry!"
    })
    assert r.status_code == 201
    data = r.json()
    assert data["enquiry_id"] == enquiry_id
    assert data["status"] == "pending"
    print(f"[PASS] POST /enquiry/{enquiry_id}/follow-up")

def test_follow_up_404():
    r = client.post("/enquiry/enq_doesnotexist/follow-up", json={"delay_minutes": 60})
    assert r.status_code == 404
    print("[PASS] POST /enquiry/invalid/follow-up -> 404")

def test_escalate(enquiry_id: str):
    r = client.post(f"/enquiry/{enquiry_id}/escalate", json={
        "reason": "Customer requested senior manager"
    })
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "escalated"
    print(f"[PASS] POST /enquiry/{enquiry_id}/escalate")

def test_history(enquiry_id: str):
    import time; time.sleep(0.5)
    r = client.get(f"/enquiry/{enquiry_id}/history")
    assert r.status_code == 200
    data = r.json()
    assert "enquiry" in data
    assert "timeline" in data
    assert len(data["timeline"]) >= 1
    print(f"[PASS] GET /enquiry/{enquiry_id}/history -> {len(data['timeline'])} events")
    print(f"  status={data['enquiry']['status']}, sop_matched={data['enquiry']['sop_matched']}")

def test_history_404():
    r = client.get("/enquiry/enq_doesnotexist/history")
    assert r.status_code == 404
    print("[PASS] GET /enquiry/invalid/history -> 404")

if __name__ == "__main__":
    print("\n-- Closira API Integration Tests --\n")
    test_health()
    id1 = test_create_enquiry_booking()
    id2 = test_create_enquiry_pricing()
    id3 = test_create_enquiry_no_sop()
    test_validation_error()
    test_follow_up(id1)
    test_follow_up_404()
    test_escalate(id2)
    test_history(id1)
    test_history(id2)
    test_history_404()
    print("\nAll tests passed!\n")
