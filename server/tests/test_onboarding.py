import datetime
import jwt
from rest_framework import status
from rest_framework.test import APITestCase

from backend.models import User
from backend.settings import SECRET_KEY


class OnboardingTestCase(APITestCase):
    def setUp(self):
        self.user = User(
            username="test-user",
            email="test@mail.com",
            password="123456",
        )
        self.user.save()
        self.token = jwt.encode(
            {
                "id": self.user.id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
            },
            SECRET_KEY,
            algorithm="HS256",
        )

    def test_get_onboarding(self):
        """Get onboarding information with a valid token"""
        resp = self.client.get(
            "/api/onboarding",
            **{"HTTP_X-ACCESS-TOKEN": self.token},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        data = resp.json()
        self.assertEqual(
            data,
            {
                "steps": [
                    [
                        {
                            "name": "firstName",
                            "label": "First Name",
                            "type": "text",
                            "required": True,
                        },
                        {"name": "lastName", "label": "Last Name", "type": "text"},
                        {"name": "bio", "label": "Bio", "type": "multiline-text"},
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
            },
        )

    def test_post_onboarding(self):
        """Submit an onboarding form request with a valid token"""

        # Access protected route with credentials
        resp = self.client.post(
            "/api/onboarding",
            {
                "steps": [
                    [
                        {
                            "name": "firstName",
                            "value": "Thomas",
                        },
                        {
                            "name": "lastName",
                            "value": "Smith",
                        },
                        {
                            "name": "bio",
                            "value": "This is my bio.",
                        },
                    ],
                    [
                        {
                            "name": "country",
                            "value": "Canada",
                        },
                        {
                            "name": "receiveNotifications",
                            "value": False,
                        },
                        {
                            "name": "receiveUpdates",
                            "value": True,
                        },
                    ],
                ],
            },
            format="json",
            **{"HTTP_X-ACCESS-TOKEN": self.token},
        )

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        data = resp.json()
        self.assertEqual(data["firstName"], "Thomas")
        self.assertEqual(data["lastName"], "Smith")
        self.assertEqual(data["country"], "Canada")
        self.assertEqual(data["bio"], "This is my bio.")
        self.assertEqual(data["receiveNotifications"], False)
        self.assertEqual(data["receiveUpdates"], True)


def generate_token(user_id: int):
    jwt.encode(
        {
            "id": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=86400),
        },
        SECRET_KEY,
        algorithm="HS256",
    )
