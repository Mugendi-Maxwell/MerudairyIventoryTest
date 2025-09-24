from services.extensions import db
from datetime import datetime, timedelta

class AdminInvite(db.Model):
    __tablename__ = 'admin_invites'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    code = db.Column(db.String(6), nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime, nullable=False)


    def __init__(self, email, code, expires_in=10, expires_at=None):
     self.email = email
     self.code = code
     if expires_at:
        self.expires_at = expires_at
     else:
        self.expires_at = datetime.utcnow() + timedelta(minutes=expires_in)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "code": self.code,
            "is_used": self.is_used,
            "expires_at": self.expires_at.isoformat(),
        }