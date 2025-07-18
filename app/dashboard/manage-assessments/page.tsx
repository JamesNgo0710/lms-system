"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, History, User, Calendar, FileText, ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

import { useTopics, useAssessments } from "@/hooks/use-api-data-store"

export default function ManageAssessmentsPage() {
  const { topics } = useTopics()
  const { assessments, addAssessment, deleteAssessment, getRecentAssessmentHistory } = useAssessments()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { toast } = useToast()

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateAssessment = (topic: (typeof topics)[0]) => {
    // Create assessment directly with defaults and redirect to edit page
    const templateQuestions = generateTemplateQuestions(topic.title, 1) // Default 1 question

    const newAssessment = addAssessment({
      topicId: topic.id,
      totalQuestions: 1, // Default 1 question
      timeLimit: "01:00", // Default 1 hour
      retakePeriod: "1", // Default 1 month (we'll remove this in UI)
      cooldownPeriod: 1, // Default 1 hour cooldown
      questions: templateQuestions,
      createdAt: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
    })

    toast({
      title: "Assessment Created",
      description: `Draft assessment created for ${topic.title}. You can now edit the questions.`,
    })

    // Redirect to edit page
    window.location.href = `/dashboard/manage-assessments/edit/${topic.id}`
  }



  const handleDeleteAssessment = (topicId: number) => {
    deleteAssessment(topicId)
    toast({
      title: "Success",
      description: "Assessment deleted successfully",
    })
  }

  // Check if topic has assessment
  const topicHasAssessment = (topicId: number) => {
    return assessments.some((assessment) => assessment.topicId === topicId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Assessments</h1>
        <p className="text-gray-600 dark:text-gray-400">Select Topic below to Create Assessment</p>
      </div>

      {/* Recently Edited Assessments */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recently Edited Assessments</h2>
          </div>
        </CardHeader>
        <CardContent>
          <RecentlyEditedAssessments getRecentAssessmentHistory={getRecentAssessmentHistory} />
        </CardContent>
      </Card>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`px-3 ${viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`px-3 ${viewMode === "list" ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      {viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Topic Card */}
          <Card className="border-2 border-dashed border-orange-300 hover:border-orange-500 transition-colors cursor-pointer">
            <Link href="/dashboard/manage-topics">
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Create</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create New Topic First</p>
              </CardContent>
            </Link>
          </Card>

          {/* Existing Topics */}
          {filteredTopics.map((topic) => {
            const hasAssessment = topicHasAssessment(topic.id)
            return (
              <Card key={topic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative">
                  <img
                    src={topic.image || "/placeholder.svg"}
                    alt={topic.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-2">{topic.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {topic.category}
                      </Badge>
                      <Badge
                        variant={hasAssessment ? "default" : "secondary"}
                        className={hasAssessment ? "bg-green-500" : "bg-gray-500"}
                      >
                        {hasAssessment ? "Has Assessment" : "No Assessment"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {hasAssessment ? (
                      <div className="flex items-center space-x-2">
                        <Link href={`/dashboard/manage-assessments/edit/${topic.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/dashboard/manage-assessments/preview/${topic.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleCreateAssessment(topic)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Create Assessment
                      </Button>
                    )}
                    {hasAssessment && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAssessment(topic.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        // List View
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Create New Topic Row */}
                <TableRow className="border-2 border-dashed border-orange-300 hover:border-orange-500 cursor-pointer">
                  <TableCell colSpan={4}>
                    <Link href="/dashboard/manage-topics" className="flex items-center justify-center py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-orange-500">Create New Topic First</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Add a topic before creating assessments</p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>

                {/* Existing Topics */}
                {filteredTopics.map((topic) => {
                  const hasAssessment = topicHasAssessment(topic.id)
                  return (
                    <TableRow key={topic.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={topic.image || "/placeholder.svg"}
                            alt={topic.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{topic.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{topic.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{topic.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={hasAssessment ? "default" : "secondary"}
                          className={hasAssessment ? "bg-green-500" : "bg-gray-500"}
                        >
                          {hasAssessment ? "Has Assessment" : "No Assessment"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {hasAssessment ? (
                            <>
                              <Link href={`/dashboard/manage-assessments/edit/${topic.id}`}>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <Link href={`/dashboard/manage-assessments/preview/${topic.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteAssessment(topic.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleCreateAssessment(topic)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Create Assessment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}


    </div>
  )
}

// Recently Edited Assessments Component
function RecentlyEditedAssessments({ getRecentAssessmentHistory }: { getRecentAssessmentHistory: (limit?: number) => any[] }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8 // 4 rows × 2 columns
  const allHistory = getRecentAssessmentHistory(20) // Reduced from 50 to 20 for better performance
  
  const totalPages = Math.max(1, Math.ceil(allHistory.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages - 1)
  const startIndex = safePage * itemsPerPage
  const currentPageHistory = allHistory.slice(startIndex, startIndex + itemsPerPage)

  if (allHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No recent assessment activity</p>
      </div>
    )
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "created": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "edited": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "deleted": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "published": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      case "unpublished": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created": return <Plus className="w-4 h-4" />
      case "edited": return <Edit className="w-4 h-4" />
      case "deleted": return <Trash2 className="w-4 h-4" />
      case "published": return <Eye className="w-4 h-4" />
      case "unpublished": return <Eye className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="space-y-4">
      {/* Grid Layout - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[320px]">
        {currentPageHistory.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors h-fit">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg flex-shrink-0 ${getActionColor(entry.action)}`}>
                {getActionIcon(entry.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{entry.topicTitle}</span>
                  <Badge variant="outline" className={`${getActionColor(entry.action)} text-xs flex-shrink-0`}>
                    {entry.action}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{entry.actionByName}</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTimeAgo(entry.timestamp)}</span>
                  </div>
                </div>
                {entry.details && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{entry.details}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Link href={`/dashboard/manage-assessments/edit/${entry.topicId}`}>
                <Button size="sm" variant="ghost" className="text-orange-500 hover:text-orange-600 p-1">
                  <Edit className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allHistory.length)} of {allHistory.length} activities
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i;
                } else if (safePage < 1) {
                  pageNum = i;
                } else if (safePage > totalPages - 2) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = safePage - 1 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={safePage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 p-0 ${safePage === pageNum ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, safePage + 1))}
              disabled={safePage >= totalPages - 1}
              className="flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Template question generator
function generateTemplateQuestions(topicTitle: string, count: number) {
  const questionTemplates: Record<string, any[]> = {
    "General Info on Blockchain Tech": [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is blockchain technology primarily used for?",
        options: ["Gaming only", "Decentralized transactions", "Social media", "Video streaming"],
        correctAnswer: 1,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        type: "true-false",
        question: "Blockchain is a centralized database system.",
        correctAnswer: "false",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which of the following is a key feature of blockchain?",
        options: ["Centralization", "Immutability", "Single point of failure", "Manual verification"],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: "true-false",
        question: "Bitcoin was the first cryptocurrency ever created.",
        correctAnswer: "true",
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What does 'mining' refer to in blockchain?",
        options: ["Extracting gold", "Validating transactions", "Creating websites", "Storing data"],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: "multiple-choice",
        question: "What is a hash function in blockchain?",
        options: [
          "A type of cryptocurrency",
          "A mathematical function that converts input to fixed output",
          "A mining tool",
          "A wallet address",
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: "true-false",
        question: "Blockchain transactions are reversible.",
        correctAnswer: "false",
      },
      {
        id: 8,
        type: "multiple-choice",
        question: "What is consensus in blockchain?",
        options: ["Agreement between users", "A type of cryptocurrency", "A wallet feature", "A mining reward"],
        correctAnswer: 0,
      },
      {
        id: 9,
        type: "true-false",
        question: "All blockchain networks are public.",
        correctAnswer: "false",
      },
      {
        id: 10,
        type: "multiple-choice",
        question: "What is a smart contract?",
        options: [
          "A legal document",
          "Self-executing contract with code",
          "A type of cryptocurrency",
          "A mining algorithm",
        ],
        correctAnswer: 1,
      },
    ],
    "Getting Started With Crypto": [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is cryptocurrency?",
        options: ["Physical money", "Digital currency", "Credit card", "Bank account"],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: "true-false",
        question: "Cryptocurrencies are controlled by central banks.",
        correctAnswer: "false",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which was the first cryptocurrency?",
        options: ["Ethereum", "Litecoin", "Bitcoin", "Ripple"],
        correctAnswer: 2,
      },
      {
        id: 4,
        type: "true-false",
        question: "You need a wallet to store cryptocurrencies.",
        correctAnswer: "true",
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What is a private key?",
        options: ["Public address", "Secret code for wallet access", "Exchange name", "Coin type"],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: "true-false",
        question: "Cryptocurrency transactions are anonymous.",
        correctAnswer: "false",
      },
      {
        id: 7,
        type: "multiple-choice",
        question: "What is market capitalization in crypto?",
        options: ["Total value of all coins", "Price per coin", "Number of transactions", "Mining difficulty"],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: "true-false",
        question: "All cryptocurrencies use the same technology.",
        correctAnswer: "false",
      },
    ],
    "Using MetaMask": [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is MetaMask?",
        options: ["A cryptocurrency", "A blockchain wallet", "An exchange", "A mining tool"],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: "true-false",
        question: "MetaMask can be used as a browser extension.",
        correctAnswer: "true",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What should you never share from your MetaMask wallet?",
        options: ["Public address", "Seed phrase", "Transaction history", "Network settings"],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: "true-false",
        question: "MetaMask only works with Bitcoin.",
        correctAnswer: "false",
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "How many words are typically in a MetaMask seed phrase?",
        options: ["8", "12", "16", "24"],
        correctAnswer: 1,
      },
    ],
    "Decentralised Finance (DeFi)": [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does DeFi stand for?",
        options: ["Digital Finance", "Decentralized Finance", "Direct Finance", "Distributed Finance"],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: "true-false",
        question: "DeFi applications require traditional banks.",
        correctAnswer: "false",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What is yield farming in DeFi?",
        options: ["Growing crops", "Earning rewards by providing liquidity", "Mining coins", "Trading stocks"],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: "true-false",
        question: "Smart contracts are essential for DeFi protocols.",
        correctAnswer: "true",
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What is a liquidity pool?",
        options: ["A swimming pool", "Collection of funds for trading", "Mining equipment", "Wallet type"],
        correctAnswer: 1,
      },
    ],
  }

  const defaultQuestions = [
    {
      id: 1,
      type: "true-false",
      question: "This topic covers important blockchain concepts.",
      correctAnswer: "true",
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "What is the main focus of this topic?",
      options: ["Basic concepts", "Advanced techniques", "Practical applications", "All of the above"],
      correctAnswer: 3,
    },
  ]

  const templates = questionTemplates[topicTitle] || defaultQuestions
  const selectedQuestions = templates.slice(0, count)

  // If we need more questions than available templates, repeat some
  while (selectedQuestions.length < count) {
    const remaining = count - selectedQuestions.length
    const additionalQuestions = templates.slice(0, remaining).map((q, index) => ({
      ...q,
      id: selectedQuestions.length + index + 1,
    }))
    selectedQuestions.push(...additionalQuestions)
  }

  return selectedQuestions
}
