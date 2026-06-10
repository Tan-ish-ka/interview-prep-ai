# Debug Session: Report Generation 500 Error

## Session Metadata
- **Session ID**: report-generation-500
- **Start Date**: 2026-06-09
- **Status**: [OPEN]

## Problem Description
User reports that clicking "Generate Report" sends a request to `/report?url=https://codeforces.com/profile/tourist`, which returns a 500 Internal Server Error, showing "Report unavailable" in the UI.

## Initial Hypotheses
1. **Backend API issue** - Codeforces API request failure or response parsing error
2. **Handle parsing error** - Issue extracting the username from the Codeforces URL
3. **Data processing error** - Problem with analytics calculation after fetching user data
4. **Missing dependencies** - Backend server not properly configured or packages missing

## Log Collection
- **Pre-fix logs**: [TBD]
- **Post-fix logs**: [TBD]

## Analysis
- **Root cause**: [TBD]
- **Fix applied**: [TBD]
