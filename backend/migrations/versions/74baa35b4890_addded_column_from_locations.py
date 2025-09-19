"""addded  column from locations

Revision ID: 74baa35b4890
Revises: 1dec2891a56a
Create Date: 2025-09-16 09:00:26.853425

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '74baa35b4890'
down_revision: Union[str, None] = '1dec2891a56a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
