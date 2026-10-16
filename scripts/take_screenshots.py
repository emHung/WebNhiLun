import time
from pathlib import Path
from playwright.sync_api import sync_playwright

OUTPUT_DIR = Path("docs/screenshots")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        print("Chrome launched successfully.")

        # --- 1. Public Pages ---
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        public_pages = [
            ("01_home.png", "http://127.0.0.1:3000/"),
            ("02_activities.png", "http://127.0.0.1:3000/activities"),
            ("03_activity_detail.png", "http://127.0.0.1:3000/activities/ACT-001"),
            ("04_stories.png", "http://127.0.0.1:3000/stories"),
            ("05_about.png", "http://127.0.0.1:3000/about"),
            ("06_auth.png", "http://127.0.0.1:3000/auth"),
        ]

        for filename, url in public_pages:
            print(f"Capturing {filename} from {url}...")
            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
            except Exception as e:
                print(f"Warning on {url}: {e}")
            time.sleep(1.5)
            page.screenshot(path=str(OUTPUT_DIR / filename))
            print(f"Saved {filename}")

        # --- 2. Volunteer Portal ---
        print("Logging in as Volunteer (TNV)...")
        page.goto("http://127.0.0.1:3000/auth", wait_until="networkidle")
        time.sleep(1)
        btn_tnv = page.locator(".demo-quick-card-btn").filter(has_text="TNV")
        btn_tnv.click()
        try:
            page.wait_for_url("**/volunteer/dashboard**", timeout=15000)
        except Exception:
            page.goto("http://127.0.0.1:3000/volunteer/dashboard")
        time.sleep(2)
        page.screenshot(path=str(OUTPUT_DIR / "07_volunteer_dashboard.png"))
        print("Saved 07_volunteer_dashboard.png")

        volunteer_pages = [
            ("08_volunteer_schedule.png", "http://127.0.0.1:3000/schedule"),
            ("09_certificates.png", "http://127.0.0.1:3000/certificates"),
            ("10_notifications.png", "http://127.0.0.1:3000/notifications"),
            ("11_profile.png", "http://127.0.0.1:3000/profile"),
        ]

        for filename, url in volunteer_pages:
            print(f"Capturing {filename} from {url}...")
            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
            except Exception as e:
                print(f"Warning on {url}: {e}")
            time.sleep(1.5)
            page.screenshot(path=str(OUTPUT_DIR / filename))
            print(f"Saved {filename}")

        context.close()

        # --- 3. Organizer Portal ---
        print("Logging in as Organizer (BTC)...")
        context_org = browser.new_context(viewport={"width": 1440, "height": 900})
        page_org = context_org.new_page()
        page_org.goto("http://127.0.0.1:3000/auth", wait_until="networkidle")
        time.sleep(1)
        btn_btc = page_org.locator(".demo-quick-card-btn").filter(has_text="BTC")
        btn_btc.click()
        try:
            page_org.wait_for_url("**/organizer/manage**", timeout=15000)
        except Exception:
            page_org.goto("http://127.0.0.1:3000/organizer/manage")
        time.sleep(2)
        page_org.screenshot(path=str(OUTPUT_DIR / "12_organizer_manage.png"))
        print("Saved 12_organizer_manage.png")

        try:
            page_org.goto("http://127.0.0.1:3000/organizer/create-event", wait_until="networkidle", timeout=20000)
        except Exception:
            pass
        time.sleep(1.5)
        page_org.screenshot(path=str(OUTPUT_DIR / "13_organizer_create_event.png"))
        print("Saved 13_organizer_create_event.png")
        context_org.close()

        # --- 4. Admin Portal ---
        print("Logging in as Admin...")
        context_admin = browser.new_context(viewport={"width": 1440, "height": 900})
        page_admin = context_admin.new_page()
        page_admin.goto("http://127.0.0.1:3000/auth", wait_until="networkidle")
        time.sleep(1)
        btn_admin = page_admin.locator(".demo-quick-card-btn").filter(has_text="Admin")
        btn_admin.click()
        try:
            page_admin.wait_for_url("**/admin/moderation**", timeout=15000)
        except Exception:
            page_admin.goto("http://127.0.0.1:3000/admin/moderation")
        time.sleep(2)
        page_admin.screenshot(path=str(OUTPUT_DIR / "14_admin_moderation.png"))
        print("Saved 14_admin_moderation.png")

        try:
            page_admin.goto("http://127.0.0.1:3000/admin/theme-settings", wait_until="networkidle", timeout=20000)
        except Exception:
            pass
        time.sleep(1.5)
        page_admin.screenshot(path=str(OUTPUT_DIR / "15_admin_theme_settings.png"))
        print("Saved 15_admin_theme_settings.png")
        context_admin.close()

        browser.close()
        print("All screenshots captured successfully!")

if __name__ == "__main__":
    main()
