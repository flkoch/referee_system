from django.apps import AppConfig


class RefereeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "referee"

    def ready(self):
        import referee.signals  # noqa: F401

        return super().ready()
