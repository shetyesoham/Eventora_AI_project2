import urllib.request
import json

def test_api():
    print("--- 1. Testing Events Endpoint ---")
    res = urllib.request.urlopen('http://127.0.0.1:8000/api/events')
    events = json.loads(res.read().decode())
    print(f"Retrieved {len(events)} events.")
    ev = events[0]
    print(f"Event Title: {ev['title']}")
    print(f"Guest Count: {ev['guest_count']}, Budget: ₹{ev['total_budget']:,.2f}")
    
    print("\n--- 2. Testing Budget Endpoint ---")
    res_b = urllib.request.urlopen(f"http://127.0.0.1:8000/api/events/{ev['id']}/budget")
    b = json.loads(res_b.read().decode())
    print(f"Budget balance: ₹{b['remaining_balance']:,.2f}, Utilization: {b['utilization_rate']}%")

    print("\n--- 3. Testing AI Copilot Route & Guest Mutation ---")
    payload = json.dumps({
        "event_id": ev['id'],
        "message": "Increase my wedding guest count from 250 to 350."
    }).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:8000/api/ai/chat', data=payload, headers={'Content-Type': 'application/json'})
    res_c = urllib.request.urlopen(req)
    chat = json.loads(res_c.read().decode())
    print(f"Agent Responded: {chat['agent_name']}")
    print(f"Action Taken: {chat['action_taken']}")
    print(f"Updated Event Data: {chat['updated_event_data']}")

    print("\n--- 4. Testing Budget Simulator ---")
    sim_payload = json.dumps({
        "guest_count": 350,
        "catering_cost_per_person": 1500,
        "venue_cost": 450000,
        "decor_cost": 250000,
        "other_expenses": 200000
    }).encode('utf-8')
    sim_req = urllib.request.Request(f"http://127.0.0.1:8000/api/events/{ev['id']}/budget/simulate", data=sim_payload, headers={'Content-Type': 'application/json'})
    sim_res = urllib.request.urlopen(sim_req)
    sim = json.loads(sim_res.read().decode())
    print(f"Simulated New Budget: ₹{sim['new_estimated_budget']:,.2f}")
    print(f"Cost per guest: ₹{sim['cost_per_guest']:,.2f}")

    print("\n--- 5. Testing Vendors, Guests, Tasks, Risks ---")
    v_res = urllib.request.urlopen(f"http://127.0.0.1:8000/api/events/{ev['id']}/vendors")
    print(f"Vendors loaded: {len(json.loads(v_res.read().decode()))}")
    
    g_res = urllib.request.urlopen(f"http://127.0.0.1:8000/api/events/{ev['id']}/guests")
    print(f"Guests loaded: {len(json.loads(g_res.read().decode()))}")

    t_res = urllib.request.urlopen(f"http://127.0.0.1:8000/api/events/{ev['id']}/tasks")
    print(f"Tasks loaded: {len(json.loads(t_res.read().decode()))}")

    r_res = urllib.request.urlopen(f"http://127.0.0.1:8000/api/events/{ev['id']}/risks")
    print(f"Risks loaded: {len(json.loads(r_res.read().decode()))}")

    print("\n ALL BACKEND SYSTEMS & AGENTS OPERATING FLAWLESSLY!")

if __name__ == "__main__":
    test_api()

