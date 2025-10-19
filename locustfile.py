"""
Locust load testing script for Tenadam Assessment Platform
Run with: locust -f locustfile.py --host=https://hub.tenadamconsulting.com
"""

from locust import HttpUser, task, between
import random
import json


class AnonymousUser(HttpUser):
    """Anonymous user browsing public pages"""
    wait_time = between(1, 3)
    
    @task(3)
    def view_homepage(self):
        """View the homepage"""
        self.client.get("/")
    
    @task(2)
    def view_about(self):
        """View about page"""
        self.client.get("/about")
    
    @task(2)
    def view_contact(self):
        """View contact page"""
        self.client.get("/contact")
    
    @task(1)
    def view_privacy(self):
        """View privacy page"""
        self.client.get("/privacy")
    
    @task(1)
    def view_terms(self):
        """View terms page"""
        self.client.get("/terms")
    
    @task(1)
    def view_signin(self):
        """View sign in page"""
        self.client.get("/auth/signin")


class AuthenticatedUser(HttpUser):
    """Authenticated user accessing assessments"""
    wait_time = between(2, 5)
    
    def on_start(self):
        """Login when user starts"""
        # Check session first
        response = self.client.get("/api/auth/session")
        if response.status_code == 200:
            session_data = response.json()
            if session_data.get("user"):
                self.authenticated = True
                self.user_id = session_data["user"].get("id")
                return
        
        self.authenticated = False
    
    @task(2)
    def view_dashboard(self):
        """View dashboard"""
        if not self.authenticated:
            return
        self.client.get("/dashboard")
    
    @task(3)
    def check_baldrige_completion(self):
        """Check Baldrige assessment completion"""
        if not self.authenticated:
            return
        self.client.get("/api/baldrige/check-completion")
    
    @task(3)
    def check_ocai_completion(self):
        """Check OCAI assessment completion"""
        if not self.authenticated:
            return
        self.client.get("/api/ocai/check-completion")
    
    @task(2)
    def view_baldrige_categories(self):
        """View Baldrige categories"""
        if not self.authenticated:
            return
        self.client.get("/api/baldrige/categories")
    
    @task(1)
    def view_baldrige_assessment(self):
        """View Baldrige assessment page"""
        if not self.authenticated:
            return
        self.client.get("/baldrige/assessment")
    
    @task(1)
    def view_assessments_page(self):
        """View employee assessments page"""
        if not self.authenticated:
            return
        self.client.get("/employee/assessments")


class OCAIAssessmentUser(HttpUser):
    """User taking OCAI assessment"""
    wait_time = between(3, 7)
    
    def on_start(self):
        """Check if user can access surveys"""
        response = self.client.get("/api/auth/session")
        if response.status_code == 200:
            session_data = response.json()
            if session_data.get("user"):
                self.authenticated = True
                self.user_id = session_data["user"].get("id")
            else:
                self.authenticated = False
        else:
            self.authenticated = False
    
    @task(5)
    def check_ocai_surveys(self):
        """Check available OCAI surveys"""
        if not self.authenticated:
            return
        
        response = self.client.get(
            "/api/surveys",
            params={"assessmentType": "OCAI", "status": "OPEN"}
        )
        
        if response.status_code == 200:
            surveys = response.json().get("surveys", [])
            if surveys:
                self.survey_id = surveys[0]["id"]
    
    @task(3)
    def view_ocai_results(self):
        """View OCAI results page"""
        if not self.authenticated:
            return
        self.client.get("/ocai/results")
    
    @task(2)
    def check_ocai_my_results(self):
        """Check user's OCAI results"""
        if not self.authenticated:
            return
        self.client.get("/ocai/my-results")


class BaldrigeAssessmentUser(HttpUser):
    """User taking Baldrige assessment"""
    wait_time = between(3, 8)
    
    def on_start(self):
        """Check authentication and get categories"""
        response = self.client.get("/api/auth/session")
        if response.status_code == 200:
            session_data = response.json()
            if session_data.get("user"):
                self.authenticated = True
                self.user_id = session_data["user"].get("id")
                
                # Get categories
                cat_response = self.client.get("/api/baldrige/categories")
                if cat_response.status_code == 200:
                    categories = cat_response.json().get("categories", [])
                    self.categories = categories
            else:
                self.authenticated = False
        else:
            self.authenticated = False
    
    @task(10)
    def get_baldrige_questions(self):
        """Load Baldrige questions for a random subcategory"""
        if not self.authenticated or not hasattr(self, 'categories'):
            return
        
        if self.categories:
            # Pick a random category
            category = random.choice(self.categories)
            if category.get('subcategories'):
                subcategory = random.choice(category['subcategories'])
                subcategory_id = subcategory.get('id')
                
                # Fetch questions for this subcategory
                self.client.get(f"/api/baldrige/questions/{subcategory_id}")
    
    @task(5)
    def check_baldrige_progress(self):
        """Check Baldrige progress"""
        if not self.authenticated:
            return
        self.client.get("/api/baldrige/progress")
    
    @task(3)
    def save_baldrige_response(self):
        """Simulate saving a Baldrige response"""
        if not self.authenticated or not hasattr(self, 'categories'):
            return
        
        if self.categories:
            category = random.choice(self.categories)
            if category.get('subcategories'):
                subcategory = random.choice(category['subcategories'])
                
                # Simulate saving a response (will fail auth but tests the endpoint)
                self.client.post(
                    "/api/baldrige/response",
                    json={
                        "questionId": "test-question-id",
                        "responseText": "Test response for load testing",
                        "categoryId": category.get('id'),
                        "subcategoryId": subcategory.get('id')
                    },
                    headers={"Content-Type": "application/json"}
                )
    
    @task(2)
    def view_baldrige_answers(self):
        """View Baldrige answers page"""
        if not self.authenticated:
            return
        self.client.get("/baldrige/answers")


class AdminUser(HttpUser):
    """Admin user accessing admin pages"""
    wait_time = between(2, 5)
    
    def on_start(self):
        """Check if user has admin access"""
        response = self.client.get("/api/auth/session")
        if response.status_code == 200:
            session_data = response.json()
            user = session_data.get("user")
            if user and user.get("role") in ["ADMIN", "SUPER_ADMIN"]:
                self.is_admin = True
            else:
                self.is_admin = False
        else:
            self.is_admin = False
    
    @task(3)
    def view_admin_dashboard(self):
        """View admin dashboard"""
        if not self.is_admin:
            return
        self.client.get("/admin/dashboard")
    
    @task(2)
    def view_admin_users(self):
        """View admin users page"""
        if not self.is_admin:
            return
        self.client.get("/admin/users")
    
    @task(2)
    def get_admin_stats(self):
        """Get admin statistics"""
        if not self.is_admin:
            return
        self.client.get("/api/admin/stats")
    
    @task(2)
    def view_admin_organizations(self):
        """View organizations"""
        if not self.is_admin:
            return
        self.client.get("/admin/organizations")
    
    @task(1)
    def view_admin_surveys(self):
        """View surveys"""
        if not self.is_admin:
            return
        self.client.get("/admin/surveys")
    
    @task(1)
    def view_admin_reports(self):
        """View reports"""
        if not self.is_admin:
            return
        self.client.get("/admin/reports")
    
    @task(1)
    def get_baldrige_responses(self):
        """Get Baldrige responses (admin)"""
        if not self.is_admin:
            return
        self.client.get("/api/admin/baldrige/responses")
    
    @task(1)
    def get_ocai_responses(self):
        """Get OCAI responses (admin)"""
        if not self.is_admin:
            return
        self.client.get("/api/admin/ocai/responses")


class APIOnlyUser(HttpUser):
    """User testing API endpoints only"""
    wait_time = between(1, 3)
    
    @task(5)
    def check_session(self):
        """Check session status"""
        self.client.get("/api/auth/session")
    
    @task(3)
    def check_surveys_api(self):
        """Check surveys API"""
        self.client.get("/api/surveys")
    
    @task(2)
    def check_assessment_progress(self):
        """Check assessment progress"""
        self.client.get("/api/assessments/progress")


