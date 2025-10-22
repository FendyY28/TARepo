from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from rest_framework.request import Request
from rest_framework.views import APIView

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
            "name": "bio",
            "label": "Bio",
            "type": "multiline-text",
        },
    ],
    [
        {
            "name": "country",
            "label": "Country",
            "type": "text",
            "required": True,
        },
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


class Onboarding(APIView):
    def get(self, request: Request):
        """Get onboarding data"""
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)

            return JsonResponse({"steps": _STEPS}, safe=False)
        except Exception as e:
            return HttpResponse(status=500)
