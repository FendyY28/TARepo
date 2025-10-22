from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView
import json

_STEPS = [
    [
        {
            "name": "firstName",
            "label": "First Name",
            "type": "text",
            "required": True,
        },
        {
            "name": "lastName",
            "label": "Last Name",
            "type": "text",
        },
        {
            "name": "country",
            "label": "Country",
            "type": "text",
            "required": True,
        },
        {
            "name": "bio",
            "label": "Bio",
            "type": "multiline-text",
        },
    ],
    [
        {
            "name": "receiveNotifications",
            "label": "I would like to receive email notifications for new messages when I'm logged out",
            "type": "yes-no",
            "required": True,
        },
        {
            "name": "receiveUpdates",
            "label": "I would like to receive updates about the product via email",
            "type": "yes-no",
            "required": True,
        },
    ],
]

# Quick validation for all fields
_ONBOARDING_FIELDS = {
    field["name"]: field for step in _STEPS for field in step
}

def serialize_user(user):
    """
    Serializes the user model to a dictionary based on the expected success response,
    excluding sensitive fields.
    """
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstName": getattr(user, 'firstName', None),
        "lastName": getattr(user, 'lastName', None),
        "bio": getattr(user, 'bio', None),
        "photoUrl": getattr(user, 'photoUrl', None),
        "country": getattr(user, 'country', None),
        "receiveNotifications": getattr(user, 'receiveNotifications', False),
        "receiveUpdates": getattr(user, 'receiveUpdates', False),
        "completedOnboarding": getattr(user, 'completedOnboarding', False),
        "createdAt": user.createdAt.isoformat(),
        "updatedAt": user.updatedAt.isoformat(),    
    }


class Onboarding(APIView):
    def get(self, request: Request):
        """Get onboarding data"""
        try:
            user = get_user(request)

            if user.is_anonymous:
                # Use JsonResponse for error consistency
                return JsonResponse({"error": "Authentication required."}, status=401)
            
            # Prevent users from re-fetching the form if already completed
            if getattr(user, 'completedOnboarding', False):
                 return JsonResponse({"error": "Onboarding already completed."}, status=403)

            return JsonResponse({"steps": _STEPS})
        except Exception as e:
            return JsonResponse({"error": "An unexpected server error occurred."}, status=500)

    def post(self, request: Request):
        """Save onboarding data"""
        user = get_user(request)

        # To ensure only a logged-in user can save
        if user.is_anonymous:
            return JsonResponse({"error": "Authentication required."}, status=401)

        # To ensure a user can only set their onboarding information once
        if getattr(user, 'completedOnboarding', False):
            return JsonResponse({"error": "Onboarding already completed."}, status=403)

        try:
            data = json.loads(request.body)
            submitted_fields = data.get("steps")

            if not isinstance(submitted_fields, list):
                return JsonResponse({"error": "Request body must contain a 'steps' array."}, status=400)
            
        except (json.JSONDecodeError, AttributeError):
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

        for item in submitted_fields:
            # To ensure each field only has 'name' and 'value'  
            if not isinstance(item, dict) or "name" not in item or "value" not in item:
                return JsonResponse({"error": "Each item in 'steps' must be an object with 'name' and 'value'."}, status=400)

            fieldName = item.get("name")
            fieldVal = item.get("value")

            if fieldName not in _ONBOARDING_FIELDS:
                return JsonResponse({"error": f"Invalid field name: {fieldName}"}, status=400)
            
            fieldDef = _ONBOARDING_FIELDS[fieldName]
            
            # To ensure the data type is correct
            if fieldDef["type"] == "yes-no" and not isinstance(fieldVal, bool):
                return JsonResponse({"error": f"Field '{fieldName}' must be a boolean."}, status=400)
            
            if fieldDef["type"] in ["text", "multiline-text"] and not isinstance(fieldVal, str):
                 return JsonResponse({"error": f"Field '{fieldName}' must be a string."}, status=400)

            if hasattr(user, fieldName):
                setattr(user, fieldName, fieldVal)

        # Mark onboarding as complete and save
        try:
            if hasattr(user, 'completedOnboarding'):
                user.completedOnboarding = True
            user.save()
        except Exception as e:
            return JsonResponse({"error": f"Failed to save data to the database: {str(e)}"}, status=500)
        
        # Return successful response
        return JsonResponse(serialize_user(user), status=200)