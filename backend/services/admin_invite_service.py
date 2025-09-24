from flask_mail import Message
from services.extensions import db, mail
from models.adminInvites import AdminInvite
import secrets
from datetime import datetime, timedelta

class AdminInviteService:

    @staticmethod
    def generate_code():
        """Generate a 6-digit code"""
        return str(secrets.randbelow(1000000)).zfill(6)

    @staticmethod
    def create_invite(email):
        code = AdminInviteService.generate_code()

        
        existing = AdminInvite.query.filter_by(email=email, is_used=False).first()

        if existing:
            
            existing.code = code
            
            existing.expires_at = AdminInvite(email=email, code=code).expires_at  
            db.session.commit()
            invite = existing
        else:
            
            invite = AdminInvite(email=email, code=code, expires_in=10)
            db.session.add(invite)
            db.session.commit()

        
        msg = Message(
            subject="Your Login Code",
            sender="your_email@gmail.com",  
            recipients=[email]
        )
        msg.body = f"Hello,\n\nYour login code is: {code}\nThis code will expire in 10 minutes."
        mail.send(msg)

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
