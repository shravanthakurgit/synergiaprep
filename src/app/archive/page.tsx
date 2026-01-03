"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileArchive,
  HardDrive,
  Tag,
  Search,
  Plus,
  Trash2,
  Calendar,
  FileText,
  BookOpen,
  Hash,
  Link as LinkIcon,
  Type,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { set } from "date-fns";

interface ArchivePDF {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  exam: "NEET" | "JEE" | "WBJEE" | "Board" | "General";
  year: number;
  fileSize: string | null;
  pages: number;
  fileType: "PDF" | "DOC" | "PPT";
  downloadUrl: string;
  category: "PYQ" | "Notes" | "Formula" | "Sample Paper" | "Reference";
}

interface UserSession {
  user?: {
    role?: string;
  };
}

const ArchivesPage: React.FC = () => {
  const [session, setSession] = useState<UserSession>({ user: { role: "user" } });
  const [archivePDFs, setArchivePDFs] = useState<ArchivePDF[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ArchivePDF>>({
    title: "",
    description: "",
    subjects: [],
    exam: "General",
    year: new Date().getFullYear(),
    fileSize: "",
    pages: 1,
    fileType: "PDF",
    downloadUrl: "",
    category: "Notes",
  });

  const { data: sessions } = useSession(); 
  let role = sessions?.user?.role || "user";
  const isAdmin = role.toLocaleLowerCase() === "admin" || role.toLocaleLowerCase() === "superadmin";

  const [subjectInput, setSubjectInput] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<ArchivePDF | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);  

  // Mock session
  useEffect(() => {
    const mockSession: UserSession = {
      user: { role: "admin" },
    };
    setSession(mockSession);
  }, []);

  // Fetch archives
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await fetch("/api/archives");
        if (!res.ok) throw new Error("Failed to fetch archives");
        const data: ArchivePDF[] = await res.json();
        setArchivePDFs(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load archives");
      }
    };
    fetchArchives();
  }, []);

  // Filtered PDFs
  const filteredPDFs = useMemo(() => {
    return archivePDFs.filter(pdf =>
      (!selectedExam || pdf.exam === selectedExam) &&
      (searchQuery === "" ||
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [archivePDFs, selectedExam, searchQuery]);

  const availableExams = useMemo(() => [...new Set(archivePDFs.map(pdf => pdf.exam))], [archivePDFs]);

  const handleDownload = (pdf: ArchivePDF) => {
    const link = document.createElement("a");
    link.href = pdf.downloadUrl ?? "#";
    link.download = `${pdf.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add PDF (POST)
  const handleAddPdf = async () => {
    try {
      if (!formData.title || !formData.downloadUrl) {
        toast.error("Title and download URL are required");
        return;
      }
      
      // Validate year
      if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear())) {
        toast.error("Please enter a valid year");
        return;
      }
      
      // Validate pages
      if (formData.pages && formData.pages < 1) {
        toast.error("Number of pages must be at least 1");
        return;
      }

      const newPdf: ArchivePDF = {
        id: Date.now().toString(),
        title: formData.title!,
        description: formData.description || "",
        subjects: formData.subjects || [],
        exam: formData.exam as ArchivePDF["exam"],
        year: formData.year || new Date().getFullYear(),
        fileSize: formData.fileSize || null,
        pages: formData.pages || 1,
        fileType: formData.fileType as ArchivePDF["fileType"],
        downloadUrl: formData.downloadUrl!,
        category: formData.category as ArchivePDF["category"] || "Notes",
      };
      
      const res = await fetch("/api/archives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPdf),
      });
      
      if (!res.ok) throw new Error("Failed to add PDF");
      setArchivePDFs([...archivePDFs, newPdf]);
      toast.success("PDF added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add PDF");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subjects: [],
      exam: "General",
      year: new Date().getFullYear(),
      fileSize: "",
      pages: 1,
      fileType: "PDF",
      downloadUrl: "",
      category: "Notes",
    });
    setSubjectInput("");
  };

  // Delete PDF
  const handleDeletePdf = async () => {
    if (!selectedPdf) return;
    setIsDeleteing(true);
    try {
      const res = await fetch(`/api/archives?id=${selectedPdf.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete PDF");
      setArchivePDFs(archivePDFs.filter(pdf => pdf.id !== selectedPdf.id));
      toast.success("PDF deleted!");
      setIsDeleteDialogOpen(false);
      setSelectedPdf(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete PDF");
    } finally {
      setIsDeleteing(false);
    }
  };

  const addSubject = () => {
    const trimmedSubject = subjectInput.trim();
    if (trimmedSubject && !(formData.subjects || []).includes(trimmedSubject)) {
      setFormData({
        ...formData,
        subjects: [...(formData.subjects || []), trimmedSubject],
      });
      setSubjectInput("");
    }
  };

  const removeSubject = (sub: string) => {
    setFormData({
      ...formData,
      subjects: (formData.subjects || []).filter(s => s !== sub),
    });
  };

  // Generate year options (last 50 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 50; i--) {
      years.push(i);
    }
    return years;
  }, []);

  const renderArchiveCard = (pdf: ArchivePDF) => (
    <div key={pdf.id} className="h-full">
      <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-green-200 bg-white flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{pdf.title}</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{pdf.exam}</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{pdf.description || "No description"}</p>
        </CardHeader>

        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            {(pdf.subjects.length > 0) ? pdf.subjects.map((s, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">{s}</Badge>
            )) : <span className="text-sm text-gray-400">No subjects</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
              <HardDrive className="h-4 w-4 text-gray-600"/>
              <span className="text-sm font-medium text-gray-700">{pdf.fileSize ?? "—"}</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Tag className="h-4 w-4 text-blue-600"/>
              <span className="text-sm font-medium text-blue-700">{pdf.category}</span>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => { setSelectedPdf(pdf); setIsDeleteDialogOpen(true); }}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            onClick={() => handleDownload(pdf)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2"/>
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" />
      <main className="flex-grow pt-16">
        <div className="container mx-auto p-4 pt-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 py-12 text-center mb-8 rounded-lg shadow-sm">
            <FileArchive className="h-16 w-16 text-green-600 mx-auto mb-4"/>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Study Materials Archive</h1>
            <p className="text-xl text-gray-600 mb-2">Free downloadable PDFs, notes, formulas, and previous year questions</p>
            <p className="text-lg text-gray-500">All resources are completely free. No login required!</p>
          </div>

          {/* Filters and Add button */}
          <div className="shadow-sm rounded-lg p-6 bg-white border mb-8 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by title, description, or subjects"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <Select value={selectedExam || "all-exams"} onValueChange={v => setSelectedExam(v === "all-exams" ? null : v)}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Exam" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Exams</SelectLabel>
                  <SelectItem value="all-exams">All Exams</SelectItem>
                  {availableExams.map((exam, idx) => <SelectItem key={idx} value={exam}>{exam}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                    <Plus className="h-4 w-4"/> Add PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Add New Study Material</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Fill all details to add new study material to the archive
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                          <Type className="h-4 w-4" />
                          Title *
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter material title"
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4" />
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter material description"
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      {/* Download URL */}
                      <div className="space-y-2">
                        <Label htmlFor="downloadUrl" className="flex items-center gap-2 text-sm font-medium">
                          <LinkIcon className="h-4 w-4" />
                          Download URL *
                        </Label>
                        <Input
                          id="downloadUrl"
                          placeholder="https://example.com/file.pdf"
                          value={formData.downloadUrl}
                          onChange={e => setFormData({...formData, downloadUrl: e.target.value})}
                          className="w-full"
                        />
                      </div>

                      {/* File Size */}
                      <div className="space-y-2">
                        <Label htmlFor="fileSize" className="flex items-center gap-2 text-sm font-medium">
                          <HardDrive className="h-4 w-4" />
                          File Size
                        </Label>
                        <Input
                          id="fileSize"
                          placeholder="e.g., 5.2 MB, 1.5 GB"
                          value={formData.fileSize || ""}
                          onChange={e => setFormData({...formData, fileSize: e.target.value})}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Exam Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="exam" className="flex items-center gap-2 text-sm font-medium">
                          <BookOpen className="h-4 w-4" />
                          Exam
                        </Label>
                        <Select
                          value={formData.exam}
                          onValueChange={(value: ArchivePDF["exam"]) => setFormData({...formData, exam: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select exam" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Exams</SelectLabel>
                              {["NEET", "JEE", "WBJEE", "Board", "General"].map((exam) => (
                                <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year */}
                      <div className="space-y-2">
                        <Label htmlFor="year" className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4" />
                          Year
                        </Label>
                        <Select
                          value={formData.year?.toString()}
                          onValueChange={(value) => setFormData({...formData, year: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Year</SelectLabel>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                          <Tag className="h-4 w-4" />
                          Category
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value: ArchivePDF["category"]) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {["PYQ", "Notes", "Formula", "Sample Paper", "Reference"].map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* File Type */}
                      <div className="space-y-2">
                        <Label htmlFor="fileType" className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="h-4 w-4" />
                          File Type
                        </Label>
                        <Select
                          value={formData.fileType}
                          onValueChange={(value: ArchivePDF["fileType"]) => setFormData({...formData, fileType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select file type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>File Types</SelectLabel>
                              {["PDF", "DOC", "PPT"].map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pages */}
                      <div className="space-y-2">
                        <Label htmlFor="pages" className="flex items-center gap-2 text-sm font-medium">
                          <Hash className="h-4 w-4" />
                          Number of Pages
                        </Label>
                        <Input
                          id="pages"
                          type="number"
                          min="1"
                          placeholder="Enter number of pages"
                          value={formData.pages}
                          onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subjects Section - Full Width */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subjects</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a subject (press Enter to add)"
                          value={subjectInput}
                          onChange={e => setSubjectInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSubject())}
                          className="flex-1"
                        />
                        <Button type="button" onClick={addSubject} variant="outline">
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {(formData.subjects || []).map((sub, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="px-3 py-1.5 flex items-center gap-2"
                        >
                          {sub}
                          <button
                            type="button"
                            onClick={() => removeSubject(sub)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {(!formData.subjects || formData.subjects.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No subjects added yet</span>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="pt-6 border-t">
                    <Button variant="outline" onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddPdf}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!formData.title || !formData.downloadUrl}
                    >
                      Add to Archive
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Archive Cards */}
          <div className={`grid gap-6 ${filteredPDFs.length ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : ""}`}>
            {filteredPDFs.length > 0 ? filteredPDFs.map(renderArchiveCard) : (
              <div className="col-span-full text-center py-12">
                <FileArchive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No study materials found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation */}
      {isDeleteDialogOpen && selectedPdf && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Study Material</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedPdf.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button disabled={isDeleteing} className="bg-red-600 hover:bg-red-700" onClick={handleDeletePdf}>
                {isDeleteing ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default ArchivesPage;