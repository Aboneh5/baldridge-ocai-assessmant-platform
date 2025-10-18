"""
Simple Load Test Script for Tenadam Assessment Platform
No C++ compiler required - works on Windows!

Requirements: pip install requests

Usage: python simple-load-test.py
"""

import requests
import threading
import time
from datetime import datetime
from collections import defaultdict
import statistics


class SimpleLoadTest:
    def __init__(self, host="https://hub.tenadamconsulting.com"):
        self.host = host
        self.results = defaultdict(list)
        self.errors = defaultdict(int)
        self.lock = threading.Lock()
        self.total_requests = 0
        self.failed_requests = 0
        
    def test_endpoint(self, path, name=None):
        """Test a single endpoint"""
        if name is None:
            name = path
            
        url = f"{self.host}{path}"
        start_time = time.time()
        
        try:
            response = requests.get(url, timeout=10)
            response_time = (time.time() - start_time) * 1000  # milliseconds
            
            with self.lock:
                self.total_requests += 1
                self.results[name].append({
                    'response_time': response_time,
                    'status_code': response.status_code,
                    'success': 200 <= response.status_code < 400
                })
                
                if not (200 <= response.status_code < 400):
                    self.failed_requests += 1
                    self.errors[name] += 1
                    
        except Exception as e:
            response_time = (time.time() - start_time) * 1000
            
            with self.lock:
                self.total_requests += 1
                self.failed_requests += 1
                self.errors[name] += 1
                self.results[name].append({
                    'response_time': response_time,
                    'status_code': 0,
                    'success': False,
                    'error': str(e)
                })
    
    def worker(self, endpoints, duration=60):
        """Worker thread that continuously hits endpoints"""
        end_time = time.time() + duration
        
        while time.time() < end_time:
            for path, name in endpoints:
                if time.time() >= end_time:
                    break
                self.test_endpoint(path, name)
            time.sleep(0.1)  # Small delay between requests
    
    def run_test(self, num_users=10, duration=60, endpoints=None):
        """Run the load test"""
        if endpoints is None:
            endpoints = [
                ("/", "Homepage"),
                ("/about", "About Page"),
                ("/contact", "Contact Page"),
                ("/api/auth/session", "Auth Session API"),
            ]
        
        print(f"\n{'='*60}")
        print(f">> Starting Load Test")
        print(f"{'='*60}")
        print(f"Target: {self.host}")
        print(f"Virtual Users: {num_users}")
        print(f"Duration: {duration}s")
        print(f"Endpoints: {len(endpoints)}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")
        
        # Create and start threads
        threads = []
        for i in range(num_users):
            t = threading.Thread(target=self.worker, args=(endpoints, duration))
            t.daemon = True
            threads.append(t)
        
        start_time = time.time()
        
        # Start all threads
        for t in threads:
            t.start()
        
        # Progress indicator
        while any(t.is_alive() for t in threads):
            elapsed = time.time() - start_time
            progress = min(100, (elapsed / duration) * 100)
            print(f"\rProgress: [{('='*int(progress/2)).ljust(50)}] {progress:.1f}%", end='', flush=True)
            time.sleep(0.5)
        
        print("\n\n>> Test completed! Analyzing results...\n")
        
        # Wait for all threads to complete
        for t in threads:
            t.join()
        
        # Calculate and display results
        self.display_results(time.time() - start_time)
    
    def display_results(self, total_time):
        """Display test results"""
        print(f"{'='*60}")
        print(f"TEST RESULTS")
        print(f"{'='*60}\n")
        
        print(f"Total Duration: {total_time:.2f}s")
        print(f"Total Requests: {self.total_requests}")
        print(f"Failed Requests: {self.failed_requests}")
        print(f"Success Rate: {((self.total_requests - self.failed_requests) / self.total_requests * 100):.2f}%")
        print(f"Requests/sec: {self.total_requests / total_time:.2f}\n")
        
        print(f"{'Endpoint':<30} {'Requests':<10} {'Avg (ms)':<10} {'Min (ms)':<10} {'Max (ms)':<10} {'Errors'}")
        print(f"{'-'*95}")
        
        for name, results in sorted(self.results.items()):
            if results:
                times = [r['response_time'] for r in results]
                avg_time = statistics.mean(times)
                min_time = min(times)
                max_time = max(times)
                num_requests = len(results)
                errors = self.errors[name]
                
                print(f"{name:<30} {num_requests:<10} {avg_time:<10.2f} {min_time:<10.2f} {max_time:<10.2f} {errors}")
        
        print(f"\n{'='*60}")
        
        # Performance assessment
        print(f"\nPERFORMANCE ASSESSMENT\n")
        
        overall_times = []
        for results in self.results.values():
            overall_times.extend([r['response_time'] for r in results])
        
        if overall_times:
            avg_response = statistics.mean(overall_times)
            p95_response = sorted(overall_times)[int(len(overall_times) * 0.95)]
            p99_response = sorted(overall_times)[int(len(overall_times) * 0.99)]
            
            print(f"Average Response Time: {avg_response:.2f}ms")
            print(f"95th Percentile: {p95_response:.2f}ms")
            print(f"99th Percentile: {p99_response:.2f}ms")
            print()
            
            # Performance rating
            success_rate = ((self.total_requests - self.failed_requests) / self.total_requests * 100)
            
            if success_rate >= 99 and p95_response < 500:
                print("[EXCELLENT] Your application is performing great!")
            elif success_rate >= 95 and p95_response < 1000:
                print("[GOOD] Performance is acceptable")
            elif success_rate >= 90 and p95_response < 2000:
                print("[WARNING] Performance could be improved")
            else:
                print("[CRITICAL] Performance issues detected!")
            
            print()


def main():
    """Main function"""
    # Configuration
    HOST = "https://hub.tenadamconsulting.com"
    
    print("\n" + "="*60)
    print("  TENADAM ASSESSMENT PLATFORM - LOAD TEST")
    print("="*60)
    print("\nSelect test type:")
    print("1. Quick Test (10 users, 30 seconds)")
    print("2. Light Test (25 users, 60 seconds)")
    print("3. Medium Test (50 users, 120 seconds)")
    print("4. Heavy Test (100 users, 180 seconds)")
    print("5. Custom Test")
    print()
    
    choice = input("Enter your choice (1-5): ").strip()
    
    if choice == "1":
        users, duration = 10, 30
        test_name = "Quick Test"
    elif choice == "2":
        users, duration = 25, 60
        test_name = "Light Test"
    elif choice == "3":
        users, duration = 50, 120
        test_name = "Medium Test"
    elif choice == "4":
        users, duration = 100, 180
        test_name = "Heavy Test"
    elif choice == "5":
        users = int(input("Number of users: "))
        duration = int(input("Duration (seconds): "))
        test_name = "Custom Test"
    else:
        print("Invalid choice. Using Quick Test.")
        users, duration = 10, 30
        test_name = "Quick Test"
    
    print(f"\n>> Running: {test_name}")
    
    # Define endpoints to test
    endpoints = [
        ("/", "Homepage"),
        ("/about", "About Page"),
        ("/contact", "Contact Page"),
        ("/privacy", "Privacy Page"),
        ("/terms", "Terms Page"),
        ("/api/auth/session", "Auth Session API"),
        ("/auth/signin", "Sign In Page"),
        ("/dashboard", "Dashboard"),
        ("/assessments/baldrige", "Baldrige Assessment"),
        ("/assessments/ocai", "OCAI Assessment"),
    ]
    
    # Run the test
    test = SimpleLoadTest(host=HOST)
    test.run_test(num_users=users, duration=duration, endpoints=endpoints)
    
    print("\n" + "="*60)
    print("Test complete! Review the results above.")
    print("="*60 + "\n")
    
    input("Press Enter to exit...")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[WARNING] Test interrupted by user")
    except Exception as e:
        print(f"\n\n[ERROR] {e}")

