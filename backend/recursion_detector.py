import ast
from collections import defaultdict

def is_recursive_function(func_node):
    if not isinstance(func_node, ast.FunctionDef):
        return False
    
    func_name = func_node.name

    for node in ast.walk(func_node):
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == func_name:
                return True
            
    return False


def extract_recursive_function(code):
    try:
        tree = ast.parse(code)
    except:
        return []
    
    recursive_funcs = []

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            if is_recursive_function(node):
                recursive_funcs.append({
                    "name" : node.name,
                    "lineno" : node.lineno
                })

    return recursive_funcs

    