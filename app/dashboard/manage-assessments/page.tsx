"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTopics, useAssessments } from "@/hooks/use-data-store"

export default function ManageAssessmentsPage() {
  const { topics } = useTopics()
  const { assessments, addAssessment, deleteAssessment } = useAssessments()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<(typeof topics)[0] | null>(null)
  const [formData, setFormData] = useState({
    totalQuestions: "",
    timeLimit: "",
    retakePeriod: "",
  })
  const { toast } = useToast()

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateAssessment = (topic: (typeof topics)[0]) => {
    setSelectedTopic(topic)
    setFormData({ totalQuestions: "", timeLimit: "", retakePeriod: "" })
    setIsCreateDialogOpen(true)
  }

  const handleSubmitAssessment = () => {
    if (!selectedTopic || !formData.totalQuestions) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const templateQuestions = generateTemplateQuestions(selectedTopic.title, Number.parseInt(formData.totalQuestions))

    addAssessment({
      topicId: selectedTopic.id,
      totalQuestions: Number.parseInt(formData.totalQuestions),
      timeLimit: formData.timeLimit || "01:00",
      retakePeriod: formData.retakePeriod || "3",
      questions: templateQuestions,
      createdAt: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
    })

    toast({
      title: "Success",
      description: `Assessment created for ${selectedTopic?.title} with ${templateQuestions.length} questions`,
    })
    setIsCreateDialogOpen(false)
    setFormData({ totalQuestions: "", timeLimit: "", retakePeriod: "" })
    setSelectedTopic(null)
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
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-gray-600">Select Topic below to Create Assessment</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Topic Card */}
        <Card className="border-2 border-dashed border-orange-300 hover:border-orange-500 transition-colors cursor-pointer">
          <Link href="/dashboard/manage-topics">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-orange-500 mb-2">Create</h3>
              <p className="text-sm text-gray-600">Create New Topic First</p>
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

      {/* Create Assessment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
          <DialogHeader className="bg-orange-500 text-center -m-6 mb-6 p-6">
            <DialogTitle>Create Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-orange-400">Topic:</Label>
              <div className="text-white font-medium">{selectedTopic?.title}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Total Questions *</Label>
              <Select
                value={formData.totalQuestions}
                onValueChange={(value) => setFormData({ ...formData, totalQuestions: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Time Limit</Label>
              <Select
                value={formData.timeLimit}
                onValueChange={(value) => setFormData({ ...formData, timeLimit: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:30">30 minutes</SelectItem>
                  <SelectItem value="01:00">1 hour</SelectItem>
                  <SelectItem value="01:30">1.5 hours</SelectItem>
                  <SelectItem value="02:00">2 hours</SelectItem>
                  <SelectItem value="03:00">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Re-Take Period</Label>
              <Select
                value={formData.retakePeriod}
                onValueChange={(value) => setFormData({ ...formData, retakePeriod: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select re-take period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitAssessment} className="w-full bg-orange-500 hover:bg-orange-600">
              Create Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
