# Phase 1 Testing Guide

## Quick Start

1. **Start the dev server** from the `frontend` directory:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to GameDemo page** at `/pages/GameDemo.tsx`

3. **Test the levels** in order (Level 1 → Level 10)

## Test Cases

### Level 1: Create Database
**Command:** `CREATE DATABASE vrindavan;`
- **Input the command** into the editor
- **Click Execute SQL**
- **Expected**: ✅ Green success message "Database 'vrindavan' created successfully"
- **City Effect**: Land background appears

---

### Level 2: Create Dharamshala Table
**Command:**
```sql
CREATE TABLE dharamshala (
  id INT PRIMARY KEY,
  name TEXT,
  capacity INT
);
```
- **Input the exact command** (formatting matters slightly less)
- **Click Execute SQL**
- **Expected**: ✅ Green success message "Table 'dharamshala' created"
- **City Effect**: Foundation appears below land

---

### Level 3: Build Dharamshala
**Command:**
```sql
INSERT INTO dharamshala (id, name, capacity)
VALUES (1, 'Sacred Rest House', 50);
```
- **Input the command**
- **Click Execute SQL**
- **Expected**: ✅ Green success message "1 row inserted"
- **City Effect**: Orange building appears

---

### Level 4: Add Pilgrims Table
**Command:**
```sql
CREATE TABLE pilgrims (
  id INT PRIMARY KEY,
  name TEXT
);
```
- **Expected**: ✅ "Table 'pilgrims' created"
- **City Effect**: Population layer indicator

---

### Level 5: Populate Dharamshala
**Command:**
```sql
INSERT INTO pilgrims (id, name)
VALUES 
  (1, 'Radha'),
  (2, 'Krishna');
```
- **Expected**: ✅ "2 rows inserted"
- **City Effect**: Two pilgrim figures appear on screen

---

### Level 6: Count Pilgrims (SELECT Test)
**Command:**
```sql
SELECT COUNT(*) as total_pilgrims
FROM pilgrims;
```
- **This is a SELECT query** - results will display in a table
- **Expected Output**:
  ```
  total_pilgrims
  2
  ```
- **Expected Message**: ✅ "Query returned 1 rows"
- **City Effect**: Occupancy indicator appears above Dharamshala

---

### Level 7: Upgrade Dharamshala
**Command:**
```sql
UPDATE dharamshala 
SET capacity = 100 
WHERE id = 1;
```
- **Expected**: ✅ "1 row updated"
- **City Effect**: Building grows taller

---

### Level 8: Create Temple
**Command:**
```sql
CREATE TABLE temple (
  id INT PRIMARY KEY,
  name TEXT,
  deity TEXT
);
```
- **Expected**: ✅ "Table 'temple' created"
- **City Effect**: Temple foundation appears

---

### Level 9: Connect Pilgrims to Temple (ALTER TABLE)
**Command:**
```sql
ALTER TABLE pilgrims 
ADD COLUMN temple_id INT;
```
- **Expected**: ✅ "Table altered successfully" or "Column 'temple_id' added"
- **City Effect**: Paths appear connecting buildings

---

### Level 10: Pilgrims Visit Temple
**Command:**
```sql
UPDATE pilgrims 
SET temple_id = 1 
WHERE id IN (1, 2);
```
- **Expected**: ✅ "2 rows updated"
- **City Effect**: 🎉 Movement animation starts (pilgrims walk between buildings)
- **Completion**: Congratulations message appears!

---

## Debugging Tips

### Database Not Initialized
**Error**: "Database not initialized. Please refresh the page."
- **Fix**: Refresh the page and try again
- **Root Cause**: sql.js library may not have loaded

### SQL Syntax Errors
**Error**: Shows the specific SQL error from sql.js
- **Check**: Spacing and capitalization in your SQL
- **Example**: `COUNT(*)` not `COUNT (*)`

### Query Validation Failed
**Error**: "Try again" with no execute button enabled
- **Cause**: Your query didn't exactly match the expected command
- **Fix**: Compare spacing, punctuation, column names exactly
- **Tip**: The expected command is shown in the gray box above the input

### SELECT Results Not Displaying
**Issue**: SELECT executes but no results table shows
- **Cause**: This is Level 6 - you must match the exact SELECT statement
- **Check**: Column name must be `total_pilgrims` (case-sensitive)

### City Elements Not Appearing
**Issue**: Query succeeded but city stays the same
- **Root Cause**: City updates are triggered on successful level completion
- **Fix**: Ensure you see the green ✅ Correct! message before looking for changes

---

## Expected Output Examples

### Successful CREATE
```
✅ Correct!
Result: Table 'dharamshala' created
🏙️ Foundation appears
```

### Successful INSERT
```
✅ Correct!
Result: 2 rows inserted
🏙️ City becomes alive - people appear!
```

### Successful SELECT
```
✅ Correct!
Result: Query returned 1 rows

total_pilgrims | 
2              |

🏙️ Occupancy indicator appears above dharamshala
```

### Failed Query
```
❌ Try again
Error: table dharamshala already exists
```

---

## Progress Tracking

Watch the **progress bar** at the top:
- Shows `X/10 levels` completed
- Green bar fills as you progress
- Resets when you refresh (local state, no persistence yet)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Extra spaces in SQL | Spaces are normalized - this is okay |
| Different capitalization | SQL is case-insensitive for keywords |
| Missing semicolon | sql.js doesn't require trailing semicolons |
| Wrong table name | Check the expected command exactly |
| Wrong data type | Level schema is predefined - stick to it |
| Typo in column name | Column names must match exactly (case-sensitive) |

---

## Performance Notes

- **First level load**: May take 2-3 seconds (sql.js initialization)
- **Subsequent queries**: <100ms each (in-memory)
- **No server calls**: Everything runs in browser

---

## Success Criteria

✅ Phase 1 is working correctly when:
1. All 10 levels execute without errors
2. Each level shows appropriate success message
3. SELECT query (Level 6) displays result table
4. City visualization updates after each level
5. Progress bar reaches 10/10
6. Final congratulations message appears

---

## Next Steps

Once all 10 levels pass:
- Phase 2 will add game state tracking (XP, coins, achievements)
- Progress will be saved to database
- More complex lessons will be available
- Leaderboards will show top players

Enjoy building SQLTown! 🏘️
