import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
              <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Welcome to LMS System. These Terms of Service govern your use of our learning management platform. 
              By accessing or using our services, you agree to be bound by these terms.
            </p>

            <h3>Use of Our Services</h3>
            <ul>
              <li>You must be at least 13 years old to use our platform</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You will not use our services for any illegal or unauthorized purposes</li>
              <li>You will not interfere with or disrupt our services or servers</li>
            </ul>

            <h3>Content and Intellectual Property</h3>
            <ul>
              <li>All course content, materials, and platform features are our intellectual property</li>
              <li>You may not reproduce, distribute, or modify our content without permission</li>
              <li>You retain ownership of any content you create and share on our platform</li>
              <li>By sharing content, you grant us a license to use it for educational purposes</li>
            </ul>

            <h3>User Conduct</h3>
            <p>You agree to:</p>
            <ul>
              <li>Respect other users and maintain a positive learning environment</li>
              <li>Not share your account credentials with others</li>
              <li>Not attempt to circumvent any security measures</li>
              <li>Report any violations of these terms or inappropriate behavior</li>
              <li>Use our platform solely for educational purposes</li>
            </ul>

            <h3>Payment and Subscriptions</h3>
            <ul>
              <li>Subscription fees are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>You may cancel your subscription at any time</li>
              <li>We reserve the right to change pricing with reasonable notice</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>
              Our services are provided "as is" without warranties of any kind. We are not liable for any indirect, 
              incidental, or consequential damages arising from your use of our platform.
            </p>

            <h3>Termination</h3>
            <p>
              We may terminate or suspend your account if you violate these terms. Upon termination, 
              your right to use our services will cease immediately.
            </p>

            <h3>Contact Information</h3>
            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@lmssystem.com" className="text-orange-500 hover:text-orange-600">
                legal@lmssystem.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}