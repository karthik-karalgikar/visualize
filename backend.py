from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import copy
import traceback

app = Flask(__name__)
CORS(app)

execution_log = []
last_line = None

def tracer(frame, event, arg):
    global last_line 

    if frame.f_globals.get("__name__") != "__main__":
        return tracer
    
    frame.f_trace_opcodes = True
    
    if event == "line":
        last_line = frame.f_lineno
        snapshot_before = copy.deepcopy(frame.f_locals)
        execution_log.append({
            "before" : snapshot_before,
            "lineno" : last_line,
            "after" : None, 
            "code" : None
        })

    if event == "opcode" and frame.f_lineno == last_line: 
        snapshot_after = copy.deepcopy(frame.f_locals)
        execution_log[-1]["after"] = snapshot_after
        
    return tracer

def run_code(code):
    global execution_log, last_line
    execution_log = []
    last_line = None

    try:
        compiled = compile(code, "<user_code>", "exec")
        sys.settrace(tracer)
        exec(compiled, {"__name__" : "__main__"}, {})
        sys.settrace(None)

        code_lines = code.split('\n')
        for step in execution_log:
            if 1 <= step['lineno'] <= len(code_lines):
                step['code'] = code_lines[step['lineno'] - 1]

        return {"success" : True, "steps": execution_log}

    except Exception as e:
        sys.settrace(None)
        return {
            "success" : False, 
            "error" : str(e),
            "traceback" : traceback.format_exc()
        }
    
@app.route('/execute', methods=['POST'])

def execute_code():
    data = request.json
    code = data.get('code', '')

    if not code:
        return jsonify({"success" : False, "error" : "No code provided"}), 400
    
    result = run_code(code)
    return jsonify(result)

@app.route('/health', methods=['GET'])

def health():
    return jsonify({"status" : "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

