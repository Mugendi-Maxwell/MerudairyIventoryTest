"""drop old created_by column from locations

Revision ID: d2da0899c444
Revises: 9ac966328f38
Create Date: 2025-09-15 15:07:46.789988

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2da0899c444'
down_revision: Union[str, None] = '9ac966328f38'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
