#!/usr/bin/env python3
"""Test report generation directly."""

from interview_prep_ai.services.interview_prep_service import InterviewPrepService
from interview_prep_ai.app.dependencies import create_interview_prep_service
from interview_prep_ai.app.schemas.report import report_response_from_dict

def main():
    try:
        service = create_interview_prep_service()
        print("Calling generate_report...")
        report = service.generate_report("https://codeforces.com/profile/tourist")
        print("Success! Report generated!")
        print("Profile username:", report["profile"].username)
        
        print("Calling report_response_from_dict...")
        response = report_response_from_dict(report)
        print("Success! Response generated!")
        print("Response model valid!")
    except Exception as e:
        import traceback
        print(f"Error: {type(e).__name__}: {e}")
        print("Stack trace:")
        traceback.print_exc()

if __name__ == "__main__":
    main()
