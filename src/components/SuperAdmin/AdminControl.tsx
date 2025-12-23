"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, Shield, FileText, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Import the existing admin components
import ExamCreator from "@/components/Admin/ExamCreator2/ExamCreator"
import OtherExamForms from "@/components/Admin/Other/OtherExamForms"

// Mock admin modules
const mockAdminModules = [
  {
    id: "1",
    name: "Exam Management",
    description: "Create and manage exams, questions, and categories",
    isActive: true,
    permissions: ["create", "read", "update", "delete"],
    component: "ExamCreator",
  },
  {
    id: "2",
    name: "Subject & Category Management",
    description: "Manage subjects, chapters, and topics",
    isActive: true,
    permissions: ["create", "read", "update", "delete"],
    component: "OtherExamForms",
  },

]

// Mock admin users
const mockAdminUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    modules: ["1", "2", "4"],
    lastLogin: "2023-05-20",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    modules: ["1", "2"],
    lastLogin: "2023-05-18",
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "admin",
    modules: ["1", "2", "3", "4"],
    lastLogin: "2023-05-21",
    status: "inactive",
  },
]

// Mock activity logs
const mockActivityLogs = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    action: "Created new exam",
    details: "Created exam 'Data Science Fundamentals'",
    timestamp: "2023-05-20 14:30:45",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    action: "Updated subject",
    details: "Updated subject 'Mathematics'",
    timestamp: "2023-05-19 10:15:22",
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    userId: "1",
    userName: "John Doe",
    action: "Deleted question",
    details: "Deleted question ID 123 from exam 'Python Basics'",
    timestamp: "2023-05-18 16:45:10",
    ipAddress: "192.168.1.1",
  },
  {
    id: "4",
    userId: "3",
    userName: "Robert Johnson",
    action: "Login",
    details: "Successful login",
    timestamp: "2023-05-21 09:05:33",
    ipAddress: "192.168.1.3",
  },
  {
    id: "5",
    userId: "2",
    userName: "Jane Smith",
    action: "Added chapter",
    details: "Added chapter 'Advanced Algorithms' to subject 'Computer Science'",
    timestamp: "2023-05-17 11:20:15",
    ipAddress: "192.168.1.2",
  },
]

export default function AdminControl() {
  const [adminModules, setAdminModules] = useState<{ id: string; name: string; description: string; isActive: boolean; permissions: string[]; component: string; }[]>([])
  // const [adminUsers, setAdminUsers] = useState([])
  // const [activityLogs, setActivityLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("admin")
  const [selectedModule, setSelectedModule] = useState(null)
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [selectedAdminUser, setSelectedAdminUser] = useState(null)
  const [isAdminUserDialogOpen, setIsAdminUserDialogOpen] = useState(false)
  const [isIntegrateDialogOpen, setIsIntegrateDialogOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Simulate API call to fetch admin data
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would fetch from your API
        // const modulesResponse = await fetch('/api/admin/modules');
        // const usersResponse = await fetch('/api/admin/users');
        // const logsResponse = await fetch('/api/admin/logs');

        // Using mock data for demonstration
        setTimeout(() => {
          setAdminModules(mockAdminModules)
          // setAdminUsers(mockAdminUsers)
          // setActivityLogs(mockActivityLogs)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // const handleToggleModuleStatus = (moduleId, isActive) => {
  //   // In a real app, you would call your API to update the module status
  //   // const response = await fetch(`/api/admin/modules/${moduleId}`, {
  //   //   method: 'PATCH',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify({ isActive })
  //   // });

  //   // Update module status in the state
  //   setAdminModules(adminModules.map((module) => (module.id === moduleId ? { ...module, isActive } : module)))
  // }

  // const handleToggleAdminUserStatus = (userId, status) => {
  //   // In a real app, you would call your API to update the user status
  //   // const response = await fetch(`/api/admin/users/${userId}`, {
  //   //   method: 'PATCH',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify({ status })
  //   // });

  //   // Update user status in the state
  //   setAdminUsers(adminUsers.map((user) => (user.id === userId ? { ...user, status } : user)))
  // }

  // const handleUpdateAdminUserModules = (userId, modules) => {
  //   // In a real app, you would call your API to update the user modules
  //   // const response = await fetch(`/api/admin/users/${userId}`, {
  //   //   method: 'PATCH',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify({ modules })
  //   // });

  //   // Update user modules in the state
  //   setAdminUsers(adminUsers.map((user) => (user.id === userId ? { ...user, modules } : user)))

  //   setIsAdminUserDialogOpen(false)
  // }

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "active":
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //           <CheckCircle className="mr-1 h-3 w-3" /> Active
  //         </span>
  //       )
  //     case "inactive":
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  //           <XCircle className="mr-1 h-3 w-3" /> Inactive
  //         </span>
  //       )
  //     default:
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  //           {status}
  //         </span>
  //       )
  //   }
  // }

  const renderAdminComponent = (componentName:string) => {
    switch (componentName) {
      case "ExamCreator":
        // Provide a null draft for preview and optional onFinish handler
        return <ExamCreator draft={null} />
      case "OtherExamForms":
        return <OtherExamForms />
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">Component Not Found</h3>
            <p className="text-muted-foreground">The requested component &quot;{componentName}&quot; is not available.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Control Panel</h2>
        <p className="text-muted-foreground">Manage admin modules, users, and monitor activity.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {/* <TabsTrigger value="modules">
            <Settings className="h-4 w-4 mr-2" />
            Admin Modules
          </TabsTrigger>
          <TabsTrigger value="users">
            <Shield className="h-4 w-4 mr-2" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="activity">
            <FileText className="h-4 w-4 mr-2" />
            Activity Logs
          </TabsTrigger> */}
          <TabsTrigger value="admin">
            <Eye className="h-4 w-4 mr-2" />
            Admin Panel
          </TabsTrigger>
        </TabsList>

        {/* Admin Modules Tab */}
        {/* <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Admin Modules</CardTitle>
              <CardDescription>Enable or disable admin modules and configure permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading admin modules...</div>
              ) : adminModules.length === 0 ? (
                <div className="text-center py-8">No admin modules found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.name}</TableCell>
                        <TableCell>{module.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {module.permissions.map((permission) => (
                              <span key={permission} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={module.isActive}
                            onCheckedChange={(checked) => handleToggleModuleStatus(module.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedModule(module)
                              setIsModuleDialogOpen(true)
                            }}
                          >
                            Configure
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrate with SuperAdmin</CardTitle>
              <CardDescription>Add existing admin components to the SuperAdmin dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  You can integrate existing admin components into the SuperAdmin dashboard. This allows you to manage
                  all administrative functions from a single interface.
                </p>
                <Button onClick={() => setIsIntegrateDialogOpen(true)}>Integrate Component</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Admin Users Tab */}
        {/* <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage users with administrative access.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading admin users...</div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-8">No admin users found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.modules.map((moduleId) => {
                              const module = adminModules.find((m) => m.id === moduleId)
                              return module ? (
                                <span key={moduleId} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                  {module.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAdminUser(user)
                                  setIsAdminUserDialogOpen(true)
                                }}
                              >
                                Edit Modules
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleToggleAdminUserStatus(user.id, "inactive")}>
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleToggleAdminUserStatus(user.id, "active")}>
                                  Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Activity Logs Tab */}
        {/* <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Monitor admin user activity on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading activity logs...</div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8">No activity logs found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent> */} 

        {/* Preview Admin Panel Tab */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel Preview</CardTitle>
              <CardDescription>Preview the admin panel components.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component to preview" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminModules.map((module) => (
                      <SelectItem key={module.id} value={module.component}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedComponent && (
                  <div className="border rounded-lg p-4 mt-4">{renderAdminComponent(selectedComponent)}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Configuration Dialog */}
      {/* {selectedModule && (
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configure {selectedModule.name}</DialogTitle>
              <DialogDescription>Adjust settings and permissions for this admin module.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input id="module-name" defaultValue={selectedModule.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-description">Description</Label>
                <Textarea id="module-description" defaultValue={selectedModule.description} />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permission-create" defaultChecked={selectedModule.permissions.includes("create")} />
                    <label htmlFor="permission-create">Create</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permission-read" defaultChecked={selectedModule.permissions.includes("read")} />
                    <label htmlFor="permission-read">Read</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permission-update" defaultChecked={selectedModule.permissions.includes("update")} />
                    <label htmlFor="permission-update">Update</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permission-delete" defaultChecked={selectedModule.permissions.includes("delete")} />
                    <label htmlFor="permission-delete">Delete</label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="module-status"
                  checked={selectedModule.isActive}
                  onCheckedChange={(checked) => handleToggleModuleStatus(selectedModule.id, checked)}
                />
                <Label htmlFor="module-status">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModuleDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}

      {/* Admin User Modules Dialog */}
      {/* {selectedAdminUser && (
        <Dialog open={isAdminUserDialogOpen} onOpenChange={setIsAdminUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Modules for {selectedAdminUser.name}</DialogTitle>
              <DialogDescription>Select which admin modules this user can access.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                {adminModules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedAdminUser.modules.includes(module.id)}
                      onCheckedChange={(checked) => {
                        const updatedModules = checked
                          ? [...selectedAdminUser.modules, module.id]
                          : selectedAdminUser.modules.filter((id) => id !== module.id)

                        setSelectedAdminUser({
                          ...selectedAdminUser,
                          modules: updatedModules,
                        })
                      }}
                    />
                    <label htmlFor={`module-${module.id}`} className="font-medium">
                      {module.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdminUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateAdminUserModules(selectedAdminUser.id, selectedAdminUser.modules)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}

      {/* Integrate Component Dialog */}
      {/* <Dialog open={isIntegrateDialogOpen} onOpenChange={setIsIntegrateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Integrate Admin Component</DialogTitle>
            <DialogDescription>Add an existing admin component to the SuperAdmin dashboard.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="component-name">Component Name</Label>
              <Input id="component-name" placeholder="e.g., ExamCreator" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="component-description">Description</Label>
              <Textarea id="component-description" placeholder="Describe what this component does" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="component-path">Component Path</Label>
              <Input id="component-path" placeholder="e.g., @/components/Admin/ExamCreator" />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="permission-create" />
                  <label htmlFor="permission-create">Create</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="permission-read" defaultChecked />
                  <label htmlFor="permission-read">Read</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="permission-update" />
                  <label htmlFor="permission-update">Update</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="permission-delete" />
                  <label htmlFor="permission-delete">Delete</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIntegrateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsIntegrateDialogOpen(false)}>Integrate Component</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

