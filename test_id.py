import requests

api_key = "MGRjYmJlM2ItZTI1Yy00NjFkLTllZjQtYmQwMDBlMDgyZGZjOjF6Qk5rZWlqUW0rZk8xYW5SNksrUTRrbURxdWV5Z1hnRjhncWViL2hDdEE9"
avatar_id = "290ef1d5-9201-40f4-8c88-394a6317f10d"

persona_config = {
    "name": "Emma",
    "avatarId": avatar_id,
    "avatarModel": "cara-4",
    "voiceId": "04965b9e-ff4c-4b54-a4dc-fba6e458c760",
    "llmId": "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",
    "systemPrompt": "Test"
}

res = requests.post(
    "https://api.anam.ai/v1/auth/session-token",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"personaConfig": persona_config}
)
print("Auth Response:", res.status_code, res.text)
if res.status_code == 200:
    token = res.json().get("sessionToken")
    res2 = requests.post(
        "https://api.anam.ai/v1/engine/session",
        headers={"Authorization": f"Bearer {token}"},
        json={}
    )
    print("Engine Response:", res2.status_code, res2.text)
