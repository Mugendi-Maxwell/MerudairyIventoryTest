# controllers/admin_invite_controller.py
from flask_restful import Resource, request
from services.admin_invite_service import AdminInviteService

class AdminInviteResource(Resource):
    def post(self):
        """Endpoint to create a new admin invite"""
        data = request.get_json()
        email = data.get("email")

        if not email:
            return {"error": "Email is required."}, 400

        return AdminInviteService.create_invite(email)


class AdminInviteVerifyResource(Resource):
    def post(self):
        """Endpoint to verify code"""
        data = request.get_json()
        email = data.get("email")
        code = data.get("code")

        if not email or not code:
            return {"error": "Email and code are required."}, 400

        return AdminInviteService.verify_code(email, code)
