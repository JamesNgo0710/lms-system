import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cookie, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cookie Policy</h1>
              <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              This Cookie Policy explains how LMS System uses cookies and similar technologies to provide, 
              improve, and protect our services. By using our platform, you consent to our use of cookies 
              as described in this policy.
            </p>

            <h3>What Are Cookies?</h3>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us remember your preferences, improve your experience, and provide essential 
              functionality for our learning management system.
            </p>

            <h3>Types of Cookies We Use</h3>
            
            <h4>Essential Cookies</h4>
            <p>These cookies are necessary for our platform to function properly:</p>
            <ul>
              <li><strong>Authentication:</strong> Remember your login status and keep you signed in</li>
              <li><strong>Security:</strong> Protect against fraudulent activities and maintain platform security</li>
              <li><strong>Session Management:</strong> Maintain your session state across different pages</li>
              <li><strong>Form Data:</strong> Remember information you've entered in forms</li>
            </ul>

            <h4>Functional Cookies</h4>
            <p>These cookies enhance your experience on our platform:</p>
            <ul>
              <li><strong>Preferences:</strong> Remember your language, theme, and display settings</li>
              <li><strong>Progress Tracking:</strong> Save your course progress and bookmarks</li>
              <li><strong>Customization:</strong> Personalize your dashboard and content recommendations</li>
              <li><strong>Accessibility:</strong> Remember your accessibility preferences</li>
            </ul>

            <h4>Analytics Cookies</h4>
            <p>These cookies help us understand how our platform is used:</p>
            <ul>
              <li><strong>Usage Statistics:</strong> Track which features are most popular</li>
              <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
              <li><strong>Learning Analytics:</strong> Understand learning patterns to improve content</li>
              <li><strong>A/B Testing:</strong> Test new features and improvements</li>
            </ul>

            <h4>Marketing Cookies</h4>
            <p>These cookies help us provide relevant content and communications:</p>
            <ul>
              <li><strong>Content Personalization:</strong> Show relevant course recommendations</li>
              <li><strong>Communication Tracking:</strong> Measure the effectiveness of our emails</li>
              <li><strong>Social Media Integration:</strong> Enable sharing and social features</li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>We may use third-party services that set their own cookies:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
              <li><strong>Payment Processors:</strong> Secure payment processing</li>
              <li><strong>Content Delivery Networks:</strong> Faster content delivery</li>
              <li><strong>Social Media Platforms:</strong> Social sharing and login features</li>
            </ul>

            <h3>Managing Your Cookie Preferences</h3>
            <p>You have several options to control cookies:</p>
            
            <h4>Browser Settings</h4>
            <ul>
              <li>Most browsers allow you to block or delete cookies</li>
              <li>You can set your browser to notify you when cookies are being set</li>
              <li>You can choose to accept only first-party cookies</li>
              <li>Note: Blocking essential cookies may affect platform functionality</li>
            </ul>

            <h4>Opt-Out Options</h4>
            <ul>
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-orange-500 hover:text-orange-600" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
              <li>You can disable non-essential cookies in your account settings</li>
              <li>Contact us to opt-out of specific tracking activities</li>
            </ul>

            <h3>Cookie Retention</h3>
            <p>Different cookies have different retention periods:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a specified period (typically 30 days to 2 years)</li>
              <li><strong>Essential Cookies:</strong> Retained as long as necessary for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Typically retained for 24 months</li>
            </ul>

            <h3>Updates to This Policy</h3>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any significant 
              changes by posting a notice on our platform or sending you an email notification.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about our use of cookies or this policy, please contact us at{" "}
              <a href="mailto:privacy@lmssystem.com" className="text-orange-500 hover:text-orange-600">
                privacy@lmssystem.com
              </a>
            </p>

            <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Note:</strong> By continuing to use our platform, you acknowledge that you have read 
                and understood this Cookie Policy and consent to our use of cookies as described above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 