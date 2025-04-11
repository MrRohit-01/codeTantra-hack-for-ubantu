import os
import json

ID_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'currentQuestionId.json')

def get_current_question_id():
    if not os.path.exists(ID_FILE_PATH):
        return None
    with open(ID_FILE_PATH, 'r') as f:
        data = json.load(f)
    return data.get("id", None)

def increment_question_id():
    if not os.path.exists(ID_FILE_PATH):
        # Start at 1.1.1 by default
        new_id = "1.1.1"
        data = {"id": new_id}
    else:
        with open(ID_FILE_PATH, 'r') as f:
            data = json.load(f)
        current_id = data.get("id", "1.1.1")
        parts = current_id.split('.')
        if len(parts) == 3 and all(p.isdigit() for p in parts):
            parts[2] = str(int(parts[2]) + 1)
            new_id = ".".join(parts)
            data["id"] = new_id
        else:
            # If corrupted or invalid, reset to 1.1.1
            data["id"] = "1.1.1"
    
    with open(ID_FILE_PATH, 'w') as f:
        json.dump(data, f)
    
    return data["id"]
