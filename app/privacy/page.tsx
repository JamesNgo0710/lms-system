import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
              <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              At LMS System, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our learning management system.
            </p>

            <h3>Information We Collect</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, profile picture, and learning preferences</li>
              <li><strong>Learning Data:</strong> Course progress, assessment scores, completion rates, and study time</li>
              <li><strong>Usage Information:</strong> How you interact with our platform, features used, and performance metrics</li>
              <li><strong>Communication Data:</strong> Messages sent through our platform and support interactions</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>Provide and improve our educational services</li>
              <li>Track your learning progress and provide personalized recommendations</li>
              <li>Communicate with you about courses, updates, and support</li>
              <li>Ensure platform security and prevent fraudulent activities</li>
              <li>Generate analytics to improve our educational content</li>
            </ul>

            <h3>Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your personal information, including encryption, 
              secure servers, and regular security audits. Your payment information is processed through secure, 
              PCI-compliant payment processors.
            </p>

            <h3>Your Rights</h3>
            <ul>
              <li>Access and review your personal information</li>
              <li>Update or correct your account details</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your learning data in a portable format</li>
              <li>Opt-out of non-essential communications</li>
            </ul>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at{" "}
              <a href="mailto:privacy@lmssystem.com" className="text-orange-500 hover:text-orange-600">
                privacy@lmssystem.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}