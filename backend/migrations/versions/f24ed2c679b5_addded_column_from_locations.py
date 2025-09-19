"""addded  column from locations

Revision ID: f24ed2c679b5
Revises: 74baa35b4890
Create Date: 2025-09-16 09:04:29.336960

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f24ed2c679b5'
down_revision: Union[str, None] = '74baa35b4890'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    op.drop_column("locations", "deleted_at")
