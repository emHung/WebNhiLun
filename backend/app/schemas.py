from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from uuid import UUID
from datetime import datetime
from zoneinfo import ZoneInfo


class Envelope(BaseModel):
    success: bool = True
    data: object
    message: str | None = None


class ApplyInput(BaseModel):
    shift: str = Field(default="Toàn thời gian", max_length=255)
    experience: str | None = Field(default=None, max_length=5000)
    skills: str | None = Field(default=None, max_length=5000)


class ReviewInput(BaseModel):
    decision: str = Field(pattern="^(approve|reject)$")
    reason: str | None = Field(default=None, max_length=2000)


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=150)
    phone: str | None = Field(default=None, max_length=40)
    dob: date | None = None
    city: str | None = Field(default=None, max_length=120)
    avatar_url: str | None = Field(default=None, max_length=2048)
    bio: str | None = Field(default=None, max_length=5000)
    skills: list[str] | None = Field(default=None, max_length=50)
    cover_url: str | None = Field(default=None, max_length=2048)
    interests: list[str] | None = Field(default=None, max_length=20)

    @field_validator("name", "skills", "interests")
    @classmethod
    def nonnull(cls, value):
        if value is None:
            raise ValueError("Trường này không được null.")
        if isinstance(value, str) and not value.strip():
            raise ValueError("Tên không được để trống.")
        return value



class OrganizationCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=200)
    representative: str = Field(min_length=2, max_length=150)
    category: str = Field(min_length=2, max_length=120)
    description: str | None = Field(default=None, max_length=5000)


class ActivityScheduleInput(BaseModel):
    time_frame: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1, max_length=1000)


class ActivityCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    idempotency_key: UUID | None = None
    publish: bool = True
    draft_payload: dict[str, str | int] | None = None
    short_description: str = Field(default="", max_length=255)
    title: str = Field(min_length=3, max_length=250)
    category: str = Field(min_length=1, max_length=120)
    event_date: date
    event_time: str = Field(min_length=1, max_length=100)
    deadline_date: date | None = None
    city: str = Field(min_length=1, max_length=120)
    location: str = Field(min_length=1, max_length=500)
    capacity: int = Field(ge=1, le=100000)
    verified_hours: int = Field(default=0, ge=0, le=1000)
    description: str = Field(default="", max_length=20000)
    requirements: str | None = Field(default=None, max_length=10000)
    items_to_bring: str | None = Field(default=None, max_length=10000)
    contact: str | None = Field(default=None, max_length=500)
    banner_url: str | None = Field(default=None, max_length=2048)
    schedule: list["ActivityScheduleInput"] = Field(default_factory=list, max_length=30)

    @model_validator(mode="after")
    def valid_dates(self):
        if self.deadline_date and self.deadline_date > self.event_date:
            raise ValueError("Hạn đăng ký phải trước hoặc bằng ngày hoạt động.")
        if self.publish and self.event_date < datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")).date():
            raise ValueError("Ngày hoạt động không được ở quá khứ.")
        for key in ("title", "category", "city", "location", "event_time"):
            if self.publish and not getattr(self, key).strip():
                raise ValueError("Thông tin bắt buộc không được chỉ chứa khoảng trắng.")
        return self


class StoryInput(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    body: str = Field(min_length=10, max_length=10000)
    category: str = Field(default="all", max_length=100)


class AdminDecision(BaseModel):
    decision: str = Field(pattern="^(approve|reject)$")
    reason: str | None = Field(default=None, max_length=2000)


class FavoriteInput(BaseModel):
    activity_id: str = Field(min_length=1, max_length=100)


class NotificationReadInput(BaseModel):
    unread: bool = False


class ThemeUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    primary_color: str = Field(pattern="^#[0-9A-Fa-f]{6}$")
    cta_color: str = Field(pattern="^#[0-9A-Fa-f]{6}$")
    cta_hover_color: str | None = Field(default=None, pattern="^#[0-9A-Fa-f]{6}$")
    surface_color: str = Field(pattern="^#[0-9A-Fa-f]{6}$")
    mode: str = Field(default="light", pattern="^(light|dark)$")
    meaning: str | None = Field(default=None, max_length=1000)
