import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AccessibilityPage() {
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
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Accessibility Statement</h1>
              <p className="text-gray-600 dark:text-gray-400">Our commitment to inclusive education</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Making Learning Accessible for Everyone</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              At LMS System, we believe that education should be accessible to everyone. We are committed to providing 
              an inclusive learning environment that accommodates users with diverse abilities and needs.
            </p>

            <h3>Our Accessibility Features</h3>
            <ul>
              <li><strong>Keyboard Navigation:</strong> Full platform functionality accessible via keyboard</li>
              <li><strong>Screen Reader Support:</strong> Compatible with NVDA, JAWS, and VoiceOver</li>
              <li><strong>High Contrast Mode:</strong> Enhanced visibility options for low vision users</li>
              <li><strong>Text Scaling:</strong> Support for browser zoom up to 200% without content loss</li>
              <li><strong>Alt Text:</strong> Descriptive alternative text for all images and media</li>
              <li><strong>Captions:</strong> Video content includes accurate closed captions</li>
              <li><strong>Focus Indicators:</strong> Clear visual indicators for keyboard navigation</li>
            </ul>

            <h3>Compliance Standards</h3>
            <p>
              Our platform is designed to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
              We regularly audit our platform and continuously work to improve accessibility.
            </p>

            <h3>Assistive Technology Support</h3>
            <ul>
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice recognition software</li>
              <li>Switch navigation devices</li>
              <li>Eye-tracking systems</li>
              <li>Alternative keyboards and input devices</li>
            </ul>

            <h3>Content Accessibility</h3>
            <ul>
              <li>Clear, simple language in course materials</li>
              <li>Logical content structure with proper headings</li>
              <li>Transcripts for all audio content</li>
              <li>Downloadable course materials in multiple formats</li>
              <li>Extended time options for assessments</li>
            </ul>

            <h3>Feedback and Support</h3>
            <p>
              We welcome feedback about the accessibility of our platform. If you encounter any barriers 
              or have suggestions for improvement, please contact our accessibility team:
            </p>
            <ul>
              <li>Email: <a href="mailto:accessibility@lmssystem.com" className="text-orange-500 hover:text-orange-600">accessibility@lmssystem.com</a></li>
              <li>Phone: +1 (234) 567-8901</li>
              <li>We aim to respond to accessibility inquiries within 2 business days</li>
            </ul>

            <h3>Ongoing Improvements</h3>
            <p>
              Accessibility is an ongoing commitment. We regularly:
            </p>
            <ul>
              <li>Conduct accessibility audits and user testing</li>
              <li>Train our development team on accessibility best practices</li>
              <li>Incorporate user feedback into platform improvements</li>
              <li>Stay updated with evolving accessibility standards</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}