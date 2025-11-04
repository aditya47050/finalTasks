"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Filter, Download, Eye, CheckCircle, XCircle, Clock, ZoomIn, ZoomOut, Building, User, Users, Shield, X } from "lucide-react";
import EsevaCertificate from "./e-sevaCertificate"; 
import { FaCertificate } from "react-icons/fa";

const statusColors = {
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const statusIcons = {
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  PENDING: Clock
};

const categoryIcons = {
  Registration: FileText,
  Incharge: User,
  Bank: Building,
  Branding: Shield,
  Certificates: FaCertificate,
  "Sub-Admins": Users,
  "Sub-Admin Certificates": FaCertificate
};

const categoryColors = {
  Registration: "bg-blue-100 text-blue-800 border-blue-200",
  Incharge: "bg-purple-100 text-purple-800 border-purple-200",
  Bank: "bg-green-100 text-green-800 border-green-200",
  Branding: "bg-orange-100 text-orange-800 border-orange-200",
  Certificates: "bg-red-100 text-red-800 border-red-200",
  "Sub-Admins": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Sub-Admin Certificates": "bg-pink-100 text-pink-800 border-pink-200"
};

const ownerColors = {
  center: "bg-blue-100 text-blue-800 border-blue-200",
  subadmin: "bg-green-100 text-green-800 border-green-200"
};

export default function EsevaDocumentsView({ eseva, documents, documentsByCategory }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [currentDocument, setCurrentDocument] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  // Get unique categories and owners
  const categories = useMemo(() => {
    const cats = ["all", ...Object.keys(documentsByCategory)];
    return cats;
  }, [documentsByCategory]);

  const owners = useMemo(() => {
    const uniqueOwners = [...new Set(documents.map(doc => doc.ownerType))];
    return ["all", ...uniqueOwners];
  }, [documents]);

  // Filter documents based on search, category and owner
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.owner?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (selectedOwner !== "all") {
      filtered = filtered.filter(doc => doc.ownerType === selectedOwner);
    }

    return filtered;
  }, [documents, searchTerm, selectedCategory, selectedOwner]);

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllInCategory = (category) => {
    const categoryDocs = category === "all" 
      ? filteredDocuments 
      : filteredDocuments.filter(doc => doc.category === category);
    
    const categoryDocIds = categoryDocs.map(doc => doc.id);
    setSelectedDocuments(prev => {
      const newSelection = [...prev];
      categoryDocIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  const deselectAllInCategory = (category) => {
    const categoryDocs = category === "all" 
      ? filteredDocuments 
      : filteredDocuments.filter(doc => doc.category === category);
    
    const categoryDocIds = categoryDocs.map(doc => doc.id);
    setSelectedDocuments(prev => prev.filter(id => !categoryDocIds.includes(id)));
  };

  const viewDocument = (doc) => {
    console.log("Viewing E-Seva document:", {
      docId: doc.id,
      category: doc.category,
      owner: doc.owner,
      ownerType: doc.ownerType,
      hasCertificateData: !!doc.certificateData,
    });
    setCurrentDocument(doc);
    setZoomLevel(1);
  };

  const closeDocumentViewer = () => {
    setCurrentDocument(null);
    setZoomLevel(1);
  };

  const downloadDocument = (doc) => {
    if (doc.url) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = `${doc.title}.${doc.url.split('.').pop()}`;
      link.click();
    }
  };

  const downloadSelected = () => {
    selectedDocuments.forEach(docId => {
      const doc = documents.find(d => d.id === docId);
      if (doc && doc.url) {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = `${doc.title}.${doc.url.split('.').pop()}`;
        link.click();
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedOwner("all");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedOwner !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                E-Seva Documents
              </h1>
              <p className="text-lg text-gray-600">
                Manage all documents and certificates for {eseva.name} and its sub-admins
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Center Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.category === "Certificates").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCertificate className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sub-Admin Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.category === "Sub-Admin Certificates").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sub-Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {eseva.subAdmins?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <User className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Filter className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar Section */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-2xl w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search documents by title, description, category, or owner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10 py-3 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-base transition-all duration-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 rounded-xl border-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 bg-blue-500 text-white">
                        !
                      </Badge>
                    )}
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="flex items-center gap-2 rounded-xl text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-blue-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-purple-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedOwner !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                      Owner: {selectedOwner === "center" ? "Center Only" : "Sub-Admins Only"}
                      <button onClick={() => setSelectedOwner("all")} className="ml-1 hover:text-green-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Filters Section */}
              {showFilters && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  {/* Category Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter by Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => {
                        const CategoryIcon = categoryIcons[category] || FileText;
                        return (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category)}
                            className={`capitalize rounded-xl flex items-center gap-2 transition-all duration-200 ${
                              selectedCategory === category 
                                ? 'shadow-md transform scale-105' 
                                : 'hover:shadow-sm'
                            }`}
                            size="sm"
                          >
                            <CategoryIcon className="h-4 w-4" />
                            {category === "all" ? "All Categories" : category}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Owner Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Filter by Owner
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {owners.map(owner => {
                        const OwnerIcon = owner === "center" ? Building : Users;
                        return (
                          <Button
                            key={owner}
                            variant={selectedOwner === owner ? "default" : "outline"}
                            onClick={() => setSelectedOwner(owner)}
                            className={`capitalize rounded-xl flex items-center gap-2 transition-all duration-200 ${
                              selectedOwner === owner 
                                ? 'shadow-md transform scale-105' 
                                : 'hover:shadow-sm'
                            }`}
                            size="sm"
                          >
                            <OwnerIcon className="h-4 w-4" />
                            {owner === "all" ? "All Owners" : owner === "center" ? "Center Only" : "Sub-Admins Only"}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Actions */}
              {selectedDocuments.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedDocuments.length} document(s) selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={downloadSelected}
                      className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4" />
                      Download Selected
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDocuments([])}
                      className="rounded-xl"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h3>
          {hasActiveFilters && (
            <p className="text-sm text-gray-600">
              Filtered from {documents.length} total documents
            </p>
          )}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const StatusIcon = statusIcons[doc.status] || FileText;
            const CategoryIcon = categoryIcons[doc.category] || FileText;
            
            return (
              <Card 
                key={doc.id} 
                className={`
                  bg-white/90 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-105
                  ${selectedDocuments.includes(doc.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                `}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0 mt-1">{doc.icon}</div>
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title with proper text wrapping */}
                        <CardTitle className="text-lg font-semibold text-gray-900 break-words whitespace-normal line-clamp-2 leading-tight">
                          {doc.title}
                        </CardTitle>
                        {/* Description with proper text wrapping */}
                        <CardDescription className="text-sm text-gray-600 break-words whitespace-normal line-clamp-2 leading-relaxed">
                          {doc.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={ownerColors[doc.ownerType]}>
                            {doc.ownerType === "center" ? "Center" : "Sub-Admin"}
                          </Badge>
                          <span className="text-xs text-gray-500 break-words whitespace-normal">
                            {doc.owner}
                          </span>
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0 mt-1"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status and Category */}
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${categoryColors[doc.category] || 'bg-gray-100 text-gray-700 border-gray-300'} flex items-center gap-1 break-words whitespace-normal`}
                    >
                      <CategoryIcon className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words whitespace-normal">{doc.category}</span>
                    </Badge>
                    {doc.status && (
                      <Badge className={`${statusColors[doc.status]} flex items-center gap-1 break-words whitespace-normal`}>
                        <StatusIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="break-words whitespace-normal">{doc.status}</span>
                      </Badge>
                    )}
                  </div>

                  {/* Document View */}
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                    {(doc.category === "Certificates" || doc.category === "Sub-Admin Certificates") ? (
                      // Render actual EsevaCertificate component
                      <div className="w-full h-full transform scale-75 origin-center">
                        <EsevaCertificate data={doc.certificateData} />
                      </div>
                    ) : doc.url ? (
                      // Regular document image
                      <img
                        src={doc.url}
                        alt={doc.title}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => viewDocument(doc)}
                      />
                    ) : (
                      // No document
                      <div className="text-center text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No document uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Date */}
                  {doc.uploadDate && (
                    <p className="text-xs text-gray-500 break-words whitespace-normal">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  )}

                  {/* Remarks */}
                  {doc.remarks && (
                    <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200 break-words whitespace-normal">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "No documents match your current filters. Try adjusting your search criteria."
                  : "No documents have been uploaded yet"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} className="rounded-xl">
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Category Bulk Actions */}
        {Object.keys(documentsByCategory).map(category => (
          <div key={category} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border">
            <div>
              <h3 className="font-semibold text-gray-900 capitalize break-words whitespace-normal">{category}</h3>
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
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 break-words whitespace-normal">{currentDocument.title}</h3>
                <p className="text-sm text-gray-600 break-words whitespace-normal mt-1">{currentDocument.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className={ownerColors[currentDocument.ownerType]}>
                    {currentDocument.ownerType === "center" ? "Center" : "Sub-Admin"}
                  </Badge>
                  <span className="text-sm text-gray-600 break-words whitespace-normal">Owner: {currentDocument.owner}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {(currentDocument.category === "Certificates" || currentDocument.category === "Sub-Admin Certificates") && (
                  <>
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
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(currentDocument)}
                  disabled={!currentDocument.url}
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
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto flex items-center justify-center">
              {(currentDocument.category === "Certificates" || currentDocument.category === "Sub-Admin Certificates") ? (
                // Render actual EsevaCertificate component
                <div 
                  style={{ 
                    transform: `scale(${zoomLevel})`, 
                    transformOrigin: 'center center',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <EsevaCertificate data={currentDocument.certificateData} />
                </div>
              ) : currentDocument.url ? (
                // Regular document image
                <img 
                  src={currentDocument.url} 
                  alt={currentDocument.title} 
                  className="w-full h-auto max-w-full rounded" 
                />
              ) : (
                // No document available
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No document available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}