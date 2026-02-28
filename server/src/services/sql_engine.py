import sqlite3
import json
from typing import List, Dict, Any


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


def execute_sql_safely(setup_sql: str, user_sql: str, expected_output: List[Dict]):
    """
    Core SQL execution engine
    """
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    try:
        # 🔹 Run setup SQL (create tables + insert data)
        cursor.executescript(setup_sql)

        # 🔹 Security check (block dangerous commands)
        forbidden = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER"]
        upper_sql = user_sql.upper()

        if any(word in upper_sql for word in forbidden):
            return {
                "error": "Only SELECT queries are allowed."
            }

        # 🔹 Execute user query
        cursor.execute(user_sql)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        actual_result = normalize_result(rows, columns)

        # 🔹 Compare
        passed = compare_results(actual_result, expected_output)

        return {
            "passed": passed,
            "result": actual_result
        }

    except Exception as e:
        return {
            "error": str(e)
        }

    finally:
        conn.close()