"use client"

import Link from "next/link"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  BookOpen,
  Users,
  Award,
  Shield,
  Heart,
  ExternalLink
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LMS System</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Empowering learners worldwide with comprehensive blockchain and cryptocurrency education. 
              Join thousands of students mastering the future of finance and technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/topics" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  All Topics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/community" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Link>
              </li>
              <li>
                <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Learning</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/topics/blockchain" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Blockchain Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/topics/cryptocurrency" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Cryptocurrency Basics
                </Link>
              </li>
              <li>
                <Link href="/topics/defi" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  DeFi Protocols
                </Link>
              </li>
              <li>
                <Link href="/topics/metamask" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  MetaMask Guide
                </Link>
              </li>
              <li>
                <Link href="/topics/nft" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  NFT Marketplace
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Advanced Trading
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="mailto:support@lmssystem.com" className="hover:text-orange-500 transition-colors">
                  support@lmssystem.com
                </a>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-orange-500 transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-start text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-3 flex-shrink-0 mt-0.5" />
                <span>
                  123 Education Street<br />
                  Tech District, CA 90210<br />
                  United States
                </span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-white">Stay Updated</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  onChange={(e) => {
                    // Basic email validation - allow common email characters
                    const value = e.target.value.replace(/[^a-zA-Z0-9@\.\-_]/g, '')
                    e.target.value = value
                  }}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-r-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} LMS System. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-orange-500 transition-colors">
                Accessibility
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors">
                Cookie Policy
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400 text-xs">
                <Shield className="w-4 h-4 mr-1" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center text-gray-400 text-xs">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                <span>Made with care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}