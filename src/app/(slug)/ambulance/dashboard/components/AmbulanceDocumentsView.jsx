"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Filter, Download, Eye, CheckCircle, XCircle, Clock, ZoomIn, ZoomOut, Ambulance as AmbulanceIcon, User, Car } from "lucide-react";
import Certificate from "../components/ambulancecertificate";
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
    Personal: User,
    Registration: FileText,
    Vehicle: Car,
    Driver: User,
    Certificates: FaCertificate
};

const categoryColors = {
    Personal: "bg-purple-100 text-purple-800 border-purple-200",
    Registration: "bg-blue-100 text-blue-800 border-blue-200",
    Vehicle: "bg-orange-100 text-orange-800 border-orange-200",
    Driver: "bg-green-100 text-green-800 border-green-200",
    Certificates: "bg-red-100 text-red-800 border-red-200"
};

export default function AmbulanceDocumentsView({ ambulance, documents, documentsByCategory }) {
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentDocument, setCurrentDocument] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ["all", ...Object.keys(documentsByCategory)];
        return cats;
    }, [documentsByCategory]);

    // Filter documents based on search and category
    const filteredDocuments = useMemo(() => {
        let filtered = documents;

        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(doc => doc.category === selectedCategory);
        }

        return filtered;
    }, [documents, searchTerm, selectedCategory]);

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
        console.log("Viewing ambulance document:", {
            docId: doc.id,
            category: doc.category,
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-white rounded-full shadow-lg">
                            <AmbulanceIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Ambulance Documents
                            </h1>
                            <p className="text-lg text-gray-600">
                                Manage all your ambulance service documents and certificates
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {documents.filter(d => d.status === "APPROVED").length}
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
                                        {documents.filter(d => d.status === "PENDING").length}
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
                                    <p className="text-sm font-medium text-gray-600">Categories</p>
                                    <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
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
                            <div className="flex gap-2 flex-wrap justify-center">
                                {categories.map(category => {
                                    const CategoryIcon = categoryIcons[category] || FileText;
                                    return (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            onClick={() => setSelectedCategory(category)}
                                            className="capitalize rounded-xl flex items-center gap-2"
                                        >
                                            <CategoryIcon className="h-4 w-4" />
                                            {category === "all" ? "All Categories" : category}
                                        </Button>
                                    );
                                })}
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
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{doc.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                    {doc.title}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-gray-600 whitespace-normal">
                                                    {doc.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedDocuments.includes(doc.id)}
                                            onChange={() => toggleDocumentSelection(doc.id)}
                                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                                        />
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Status and Category */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`${categoryColors[doc.category] || 'bg-gray-100 text-gray-700 border-gray-300'} flex items-center gap-1`}
                                        >
                                            <CategoryIcon className="h-3 w-3" />
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
                                            // Render actual AmbulanceCertificate component
                                            <div className="w-full h-full transform scale-75 origin-center">
                                                <Certificate data={doc.certificateData || ambulance} />
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
                                        <p className="text-xs text-gray-500">
                                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                                        </p>
                                    )}

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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                            <p className="text-gray-600">
                                {searchTerm || selectedCategory !== "all"
                                    ? "Try adjusting your search terms or category filter"
                                    : "No documents have been uploaded yet"}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Category Bulk Actions */}
                {Object.keys(documentsByCategory).map(category => (
                    <div key={category} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border">
                        <div>
                            <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
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
                            <div>
                                <h3 className="text-lg font-semibold">{currentDocument.title}</h3>
                                <p className="text-sm text-gray-600">{currentDocument.description}</p>
                            </div>
                            <div className="flex gap-2">
                                {currentDocument.category === "Certificates" && (
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
                            {currentDocument.category === "Certificates" ? (
                                // Render actual AmbulanceCertificate component
                                <div
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        transformOrigin: 'center center',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Certificate data={currentDocument.certificateData || ambulance} />
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