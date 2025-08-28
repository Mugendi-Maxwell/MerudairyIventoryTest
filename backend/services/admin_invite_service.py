
import secrets
from datetime import datetime
from models.adminInvites import AdminInvite
from services.extensions import db

class AdminInviteService:

    @staticmethod
    def generate_code():
        
        return str(secrets.randbelow(1000000)).zfill(6)

    @staticmethod
    def create_invite(email):
        
        code = AdminInviteService.generate_code()

        
        existing = AdminInvite.query.filter_by(email=email, is_used=False).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()

       
        new_invite = AdminInvite(email=email, code=code)
        db.session.add(new_invite)
        db.session.commit()

       
        print(f"[DEBUG] Code for {email} is {code}")  

        return {"message": f"Invitation sent to {email}"}, 201

    @staticmethod
    def verify_code(email, code):
        invite = AdminInvite.query.filter_by(email=email, code=code, is_used=False).first()

        if not invite:
            return {"error": "Invalid code or email."}, 400

        if invite.expires_at < datetime.utcnow():
            return {"error": "Code has expired."}, 400

        
        invite.is_used = True
        db.session.commit()

        return {"message": "Code verified. Proceed to signup."}, 200
