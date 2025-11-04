"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import Certificate from "../components/doctorcertificate";

const statusColors = {
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const statusIcons = {
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  PENDING: Clock,
};

export default function DoctorDocumentsView({
  doctor,
  documents,
  documentsByCategory,
}) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentDocument, setCurrentDocument] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  // Get unique categories
  const categories = useMemo(() => {
    return ["all", ...Object.keys(documentsByCategory)];
  }, [documentsByCategory]);

  // Filter documents based on search and category
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    return filtered;
  }, [documents, searchTerm, selectedCategory]);

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllInCategory = (category) => {
    const categoryDocs =
      category === "all"
        ? filteredDocuments
        : filteredDocuments.filter((doc) => doc.category === category);

    const categoryDocIds = categoryDocs.map((doc) => doc.id);
    setSelectedDocuments((prev) => {
      const newSelection = [...prev];
      categoryDocIds.forEach((id) => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  const deselectAllInCategory = (category) => {
    const categoryDocs =
      category === "all"
        ? filteredDocuments
        : filteredDocuments.filter((doc) => doc.category === category);

    const categoryDocIds = categoryDocs.map((doc) => doc.id);
    setSelectedDocuments((prev) =>
      prev.filter((id) => !categoryDocIds.includes(id))
    );
  };

  const viewDocument = (doc) => {
    setCurrentDocument(doc);
    setZoomLevel(1); // Reset zoom when a new document is viewed
  };

  const closeDocumentViewer = () => {
    setCurrentDocument(null);
    setZoomLevel(1); // Reset zoom
  };

  const downloadDocument = (doc) => {
    if (doc.url) {
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = `${doc.title}.${doc.url.split(".").pop()}`;
      link.click();
    }
  };

  const downloadSelected = () => {
    selectedDocuments.forEach((docId) => {
      const doc = documents.find((d) => d.id === docId);
      if (doc && doc.url) {
        const link = document.createElement("a");
        link.href = doc.url;
        link.download = `${doc.title}.${doc.url.split(".").pop()}`;
        link.click();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all your professional documents and certificates in
            one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Documents
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter((d) => d.status === "APPROVED").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter((d) => d.status === "PENDING").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Categories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.length - 1}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize rounded-xl"
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>

              {/* Bulk Actions */}
              {selectedDocuments.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={downloadSelected}
                    className="flex items-center gap-2 rounded-xl"
                  >
                    <Download className="h-4 w-4" />
                    Download Selected ({selectedDocuments.length})
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedDocuments([])}
                    className="rounded-xl"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const StatusIcon = statusIcons[doc.status] || FileText; // Default to FileText if status is not defined

            return (
              <Card
                key={doc.id}
                className={`bg-white/90 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  selectedDocuments.includes(doc.id)
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{doc.icon}</div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status and Category */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {doc.category}
                    </Badge>
                    {doc.status && (
                      <Badge className={statusColors[doc.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {doc.status}
                      </Badge>
                    )}
                  </div>

                  {/* Document View */}
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                  {doc.category === "Certificates" ? (
  <Certificate
    data={{
      ...doctor,
      DoctorCertificate: [doc], // Pass only this specific certificate
    }}
  />
) : (
  <img
    src={doc.url}
    alt={doc.title}
    className="w-full h-full object-cover"
  />
)}

                  </div>

                  {/* Remarks */}
                  {doc.remarks && (
                    <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                      <strong>Remarks:</strong> {doc.remarks}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDocument(doc)}
                      className="flex-1 flex items-center gap-2 rounded-xl"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      disabled={!doc.url}
                      className="flex-1 flex items-center gap-2 rounded-xl"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search terms or category filter"
                  : "No documents have been uploaded yet"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Category Bulk Actions */}
        {Object.keys(documentsByCategory).map((category) => (
          <div
            key={category}
            className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border"
          >
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {category}
              </h3>
              <p className="text-sm text-gray-600">
                {documentsByCategory[category].length} documents
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAllInCategory(category)}
                className="rounded-xl"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deselectAllInCategory(category)}
                className="rounded-xl"
              >
                Deselect All
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {currentDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{currentDocument.title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="rounded-xl"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="rounded-xl"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(currentDocument)}
                  className="rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeDocumentViewer}
                  className="rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
              {currentDocument.category === "Certificates" ? (
                <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}>
           <Certificate
  data={{
    ...doctor,
    DoctorCertificate: [currentDocument],
  }}
/>

                </div>
              ) : (
                <img
                  src={currentDocument.url}
                  alt={currentDocument.title}
                  className="w-full h-auto max-w-full rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}