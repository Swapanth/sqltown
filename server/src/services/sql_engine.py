import sqlite3
import json
import re
from typing import List, Dict, Any, Tuple


def validate_sql_syntax(sql: str) -> Tuple[bool, str]:
    """
    Validate SQL syntax for common errors
    Returns: (is_valid, error_message)
    """
    sql = sql.strip()
    
    if not sql:
        return False, "SQL query cannot be empty"
    
    # Check for matching parentheses
    open_parens = sql.count('(')
    close_parens = sql.count(')')
    if open_parens != close_parens:
        return False, f"SQL Syntax Error: Mismatched parentheses. Found {open_parens} '(' but {close_parens} ')'"
    
    # Check for matching quotes
    single_quotes = sql.count("'") - sql.count("\\'")
    if single_quotes % 2 != 0:
        return False, "SQL Syntax Error: Unclosed string literal (missing closing quote)"
    
    double_quotes = sql.count('"') - sql.count('\\"')
    if double_quotes % 2 != 0:
        return False, "SQL Syntax Error: Unclosed identifier (missing closing double quote)"
    
    # Check for missing semicolon at end (for well-formed queries)
    # Only required if there are multiple statements or if it looks like a complete statement
    if sql.count(';') == 0:
        # Check if it looks like a complete SQL keyword statement
        sql_upper = sql.upper().strip()
        sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH']
        start_with_keyword = any(sql_upper.startswith(kw) for kw in sql_keywords)
        
        if start_with_keyword and not sql_upper.endswith(';'):
            return False, "SQL Syntax Error: Missing semicolon (;) at the end of the statement"
    
    # Check for incomplete queries
    sql_upper = sql.upper().strip()
    
    # SELECT without FROM/WHERE might be valid (e.g., SELECT 1), but check incomplete patterns
    if 'SELECT' in sql_upper:
        # Check for SELECT without columns
        if re.match(r'^\s*SELECT\s*(?:\n|$)', sql_upper):
            return False, "SQL Syntax Error: SELECT statement is incomplete (missing column specification)"
    
    # Check for FROM without table
    if 'FROM' in sql_upper:
        if re.search(r'FROM\s*(?:WHERE|GROUP|ORDER|LIMIT|;|$)', sql_upper):
            return False, "SQL Syntax Error: FROM clause is incomplete (missing table name)"
    
    # Check for common typos
    if 'SELET' in sql_upper:
        return False, "SQL Syntax Error: Did you mean 'SELECT' instead of 'SELET'?"
    
    if 'FORM' in sql_upper and 'FROM' not in sql_upper:
        return False, "SQL Syntax Error: Did you mean 'FROM' instead of 'FORM'?"
    
    return True, ""


def normalize_result(rows: List[tuple], columns: List[str]) -> List[Dict[str, Any]]:
    """
    Convert DB rows to list of dicts for comparison
    """
    result = []
    for row in rows:
        row_dict = {}
        for i, col in enumerate(columns):
            row_dict[col] = row[i]
        result.append(row_dict)
    return result


def compare_results(actual: List[Dict], expected: List[Dict]) -> bool:
    """
    Compare two result sets ignoring order
    """
    return sorted(actual, key=str) == sorted(expected, key=str)


def execute_sql_query(setup_sql: str, user_sql: str):
    """
    Execute a SQL query against an isolated in-memory database.
    """
    # Validate user SQL syntax first
    is_valid, error_msg = validate_sql_syntax(user_sql)
    if not is_valid:
        return {
            "error": error_msg
        }
    
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    try:
        cursor.executescript(setup_sql)

        forbidden = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER"]
        upper_sql = user_sql.upper()

        if any(word in upper_sql for word in forbidden):
            return {
                "error": "Only SELECT queries are allowed."
            }

        cursor.execute(user_sql)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description] if cursor.description else []

        actual_result = normalize_result(rows, columns)

        return {
            "result": actual_result
        }

    except sqlite3.OperationalError as e:
        # Provide more specific error messages for SQLite errors
        error_str = str(e)
        if "no such table" in error_str:
            return {"error": f"SQL Runtime Error: {error_str}"}
        elif "syntax error" in error_str:
            return {"error": f"SQL Syntax Error: {error_str}"}
        else:
            return {"error": f"SQL Error: {error_str}"}
    
    except sqlite3.ProgrammingError as e:
        return {"error": f"SQL Programming Error: {str(e)}"}
    
    except Exception as e:
        return {
            "error": f"Execution Error: {str(e)}"
        }

    finally:
        conn.close()


def execute_sql_safely(setup_sql: str, user_sql: str, expected_output: List[Dict]):
    """
    Core SQL execution engine
    """
    execution = execute_sql_query(setup_sql, user_sql)

    if "error" in execution:
        return execution

    actual_result = execution["result"]

    passed = compare_results(actual_result, expected_output)

    return {
        "passed": passed,
        "result": actual_result
    }