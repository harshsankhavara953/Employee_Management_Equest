import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import {
  People,
  AccessTime,
  EventNote,
  AccountBalanceWallet,
  Work,
  Business,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  TrendingUp,
  Email
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'
import api from '../../api/index.js'

const HrDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0
  })

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0
  })


  // Employee Management State
  const [employees, setEmployees] = useState([])
  const [employeeDialog, setEmployeeDialog] = useState({ open: false, employee: null })
  const [employeeForm, setEmployeeForm] = useState({
    user_id: '',
    employee_id: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    join_date: '',
    confirmation_date: '',
    probation_period_months: '',
    employment_type: '',
    department_name: '',
    designation_name: '',
    manager_id: ''
  })

  // Attendance Management State
  const [attendanceData] = useState([])

  // Leave Management State
  const [leaves, setLeaves] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])

  // Payroll Management State
  const [payrollData, setPayrollData] = useState([])
  const [salaryDetails, setSalaryDetails] = useState([])

  // Designation Management State
  const [designations, setDesignations] = useState([])
  const [designationDialog, setDesignationDialog] = useState({ open: false, designation: null })

  // Department Management State
  const [departments, setDepartments] = useState([])
  const [departmentManagers, setDepartmentManagers] = useState([])


  useEffect(() => {
    fetchDashboardData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchHandleDashboardData(),
        fetchEmployeeStatistics(),
        fetchAllEmployees(),
        fetchPendingApprovals(),
        fetchPayrollSummary(),
        fetchAllDesignations(),
        fetchAllSalaryDetails(),
        fetchLeaveTypes(),
        fetchDepartments(),
        fetchDepartmentManagers()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Error fetching dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Leave Type Dialog
  const [leaveTypeDialogOpen, setLeaveTypeDialog] = useState(false);
  const [leaveTypeForm, setLeaveTypeForm] = useState({
    leave_type_name: "",
    description: "",
    annual_entitlement: "",
    max_consecutive_days: "",
    carry_forward_allowed: false,
    max_carry_forward_days: "",
    requires_medical_certificate: false,
    is_paid: true,
    applicable_gender: "all",
    is_active: true,
  });


  const createLeaveType = async () => {
    try {
      await api.post("/leave-types", leaveTypeForm);
      toast.success("Leave type created successfully");
      fetchLeaveTypes();
      setLeaveTypeDialog({ open: false, leaveType: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating leave type");
    }
  };

  const fetchHandleDashboardData = async () => {
    try {
      const response = await api.get('/employees/dashboard')
      console.log("Dashboard API response:", response.data);
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  // Employee Management Functions
  const fetchEmployeeStatistics = async () => {
    try {
      const response = await api.get('/employees/statistics')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching employee statistics:', error)
    }
  }

  const fetchAllEmployees = async (params) => {
    try {
      setLoading(true);
      const response = await api.get('/employees', { params });
      setEmployees(response.data.data);
      // Pagination handled by backend
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false);
    }
  }

  // Employee functions
  const createEmployee = async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData)
      toast.success('Employee created successfully')
      // fetchAllEmployees()
      // fetchEmployeeStatistics()
      return response.data
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error('Error creating employee')
      throw error
    }
  }

  // const updateEmployee = async (id, employeeData) => {
  //   try {
  //     const response = await api.put(`/employees/${id}`, employeeData)
  //     toast.success('Employee updated successfully')
  //     fetchAllEmployees()
  //     return response.data
  //   } catch (error) {
  //     toast.error('Error updating employee')
  //     throw error
  //   }
  // }

  // const changeEmployeeStatus = async (id, status) => {
  //   try {
  //     const response = await api.patch(`/employees/${id}/status`, { status })
  //     toast.success('Employee status updated successfully')
  //     fetchAllEmployees()
  //     fetchEmployeeStatistics()
  //     return response.data
  //   } catch (error) {
  //     toast.error('Error updating employee status')
  //     throw error
  //   }
  // }

  const deleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`)
      toast.success('Employee deleted successfully')
      fetchAllEmployees()
      fetchEmployeeStatistics()
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast.error('Error deleting employee')
    }
  }

  // Attendance Management Functions
  const checkIn = async () => {
    try {
      await api.post('/attendance/check-in')
      toast.success('Checked in successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error checking in:', error)
      toast.error('Error checking in')
    }
  }

  const checkOut = async () => {
    try {
      await api.post('/attendance/check-out')
      toast.success('Checked out successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error checking out:', error)
      toast.error('Error checking out')
    }
  }

  // const updateAttendance = async (id, attendanceData) => {
  //   try {
  //     await api.put(`/attendance/${id}`, attendanceData)
  //     toast.success('Attendance updated successfully')
  //     fetchDashboardData()
  //   } catch (error) {
  //     toast.error('Error updating attendance')
  //   }
  // }

  // Leave Management Functions
  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leave-applications/pending-approvals');
      console.log("Pending Approvals API response:", response.data);
      setLeaves(response.data);
      // setStats(prev => ({ ...prev, pendingLeaves: response.data.length }));
    } catch (error) {
      console.error('Error fetching pending approvals:', error)
    } finally {
      setLoading(false);
    }
  }

  const approveLeave = async (id) => {
    try {
      await api.put(`/leaves-applications/${id}/approve`)
      toast.success('Leave approved successfully')
      fetchPendingApprovals()
    } catch (error) {
      console.error('Error approving leave:', error)
      toast.error('Error approving leave')
    }
  }

  const rejectLeave = async (id) => {
    try {
      await api.put(`/leaves-applications/${id}/reject`)
      toast.success('Leave rejected successfully')
      fetchPendingApprovals()
    } catch (error) {
      console.error('Error rejecting leave:', error)
      toast.error('Error rejecting leave')
    }
  }

  // Leave Type Management
  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get('/leave-types');
      setLeaveTypes(response.data || []);
      console.log("Leave Types API response:", response.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };




  // const updateLeaveType = async (id, leaveTypeData) => {
  //   try {
  //     await api.put(`/leave-types/${id}`, leaveTypeData)
  //     toast.success('Leave type updated successfully')
  //     fetchLeaveTypes()
  //   } catch (error) {
  //     toast.error('Error updating leave type')
  //   }
  // }

  // const deleteLeaveType = async (id) => {
  //   try {
  //     await api.delete(`/leave-types/${id}`)
  //     toast.success('Leave type deleted successfully')
  //     fetchLeaveTypes()
  //   } catch (error) {
  //     toast.error('Error deleting leave type')
  //   }
  // }

  // Payroll Management Functions
  const generatePayroll = async (payrollData) => {
    try {
      await api.post('/payroll/generate', payrollData)
      toast.success('Payroll generated successfully')
      fetchPayrollSummary()
    } catch (error) {
      console.error('Error generating payroll:', error)
      toast.error('Error generating payroll')
    }
  }

  const fetchPayrollSummary = async (month, year) => {
    try {
      setLoading(true);
      const response = await api.get('/payroll/summary', {
        params: { month, year }
      });

      const data = response.data;

      // Ensure payrollData is always an array
      setPayrollData(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error('Error fetching payroll summary:', error);
      setPayrollData([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };


  const emailPayslip = async (payrollId) => {
    try {
      await api.post(`/payroll/payslip/${payrollId}/email`)
      toast.success('Payslip emailed successfully')
    } catch (error) {
      console.error('Error emailing payslip:', error)
      toast.error('Error emailing payslip')
    }
  }

  // Salary Details Management
  const fetchAllSalaryDetails = async () => {
    try {
      const response = await api.get('/salary-details')
      setSalaryDetails(response.data)
    } catch (error) {
      console.error('Error fetching salary details:', error)
    }
  }

  // const createSalaryDetail = async (salaryData) => {
  //   try {
  //     await api.post('/salary-details', salaryData)
  //     toast.success('Salary detail created successfully')
  //     fetchAllSalaryDetails()
  //   } catch (error) {
  //     toast.error('Error creating salary detail')
  //   }
  // }

  // const updateSalaryDetail = async (id, salaryData) => {
  //   try {
  //     await api.put(`/salary-details/${id}`, salaryData)
  //     toast.success('Salary detail updated successfully')
  //     fetchAllSalaryDetails()
  //   } catch (error) {
  //     toast.error('Error updating salary detail')
  //   }
  // }

  // const deleteSalaryDetail = async (id) => {
  //   try {
  //     await api.delete(`/salary-details/${id}`)
  //     toast.success('Salary detail deleted successfully')
  //     fetchAllSalaryDetails()
  //   } catch (error) {
  //     toast.error('Error deleting salary detail')
  //   }
  // }

  // Designation Management Functions
  const fetchAllDesignations = async (params) => {
    try {
      setLoading(true);
      const response = await api.get('/designations', { params });
      console.log('Designations API Response:', response.data);
      // Handle both paginated and non-paginated responses
      const designationsData = response.data.data || response.data;

      // If no designations found, provide some defaults
      if (!designationsData || designationsData.length === 0) {
        console.log('No designations found, using defaults');
        setDesignations([
          { id: 1, designation_name: 'Software Engineer', name: 'Software Engineer' },
          { id: 2, designation_name: 'Senior Software Engineer', name: 'Senior Software Engineer' },
          { id: 3, designation_name: 'Team Lead', name: 'Team Lead' },
          { id: 4, designation_name: 'Manager', name: 'Manager' },
          { id: 5, designation_name: 'Intern', name: 'Intern' }
        ]);
      } else {
        setDesignations(designationsData);
      }
      // Pagination handled by backend
    } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error('Failed to fetch designations');
    } finally {
      setLoading(false);
    }
  }



  // const createDesignation = async (designationData) => {
  //   try {
  //     await api.post('/designations', designationData)
  //     toast.success('Designation created successfully')
  //     fetchAllDesignations()
  //   } catch (error) {
  //     toast.error('Error creating designation')
  //   }
  // }

  // const updateDesignation = async (id, designationData) => {
  //   try {
  //     await api.put(`/designations/${id}`, designationData)
  //     toast.success('Designation updated successfully')
  //     fetchAllDesignations()
  //   } catch (error) {
  //     toast.error('Error updating designation')
  //   }
  // }

  const deleteDesignation = async (id) => {
    try {
      await api.delete(`/designations/${id}`)
      toast.success('Designation deleted successfully')
      fetchAllDesignations()
    } catch (error) {
      console.error('Error deleting designation:', error)
      toast.error('Error deleting designation')
    }
  }

  // Department Management Functions
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      const data = response.data;

      // always ensure array
      setDepartments(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]); // fallback
    }
  };



  // Fetch department managers
  const fetchDepartmentManagers = async () => {
    try {
      const response = await api.get('/department/managers')
      setDepartmentManagers(response.data)
    } catch (error) {
      console.error('Error fetching department managers:', error)
    }
  }

  // Employee form handlers
  const handleEmployeeFormChange = (field, value) => {
    setEmployeeForm(prev => ({
      ...prev,
      [field]: field === 'user_id' || field === 'manager_id'
        ? (value === '' ? '' : parseInt(value))
        : value
    }))
  }

  const handleCreateEmployee = async () => {
    try {
      await createEmployee(employeeForm)
      setEmployeeDialog({ open: false, employee: null })
      setEmployeeForm({
        user_id: '',
        employee_id: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        join_date: '',
        confirmation_date: '',
        probation_period_months: '',
        employment_type: '',
        department_name: '',
        designation_name: '',
        manager_id: ''
      })
    } catch (error) {
      console.error('Error creating employee:', error)
    }
  }

  const handleCloseEmployeeDialog = () => {
    setEmployeeDialog({ open: false, employee: null })
    setEmployeeForm({
      user_id: '',
      employee_id: '',
      date_of_birth: '',
      gender: '',
      marital_status: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      join_date: '',
      confirmation_date: '',
      probation_period_months: '',
      employment_type: '',
      department_name: '',
      designation_name: '',
      manager_id: ''
    })
  }

  const tabContent = [
    {
      label: 'Overview',
      content: (
        <Box>
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <People color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboardData.totalEmployees}</Typography>
                      <Typography color="textSecondary">Total Employees</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboardData.activeEmployees}</Typography>
                      <Typography color="textSecondary">Active Employees</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <EventNote color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboardData.pendingLeaves}</Typography>
                      <Typography color="textSecondary">Pending Leaves</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>


            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setEmployeeDialog({ open: true, employee: null })}
                      >
                        Add Employee
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<AccessTime />}
                        onClick={checkIn}
                      >
                        Check In
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<AccessTime />}
                        onClick={checkOut}
                      >
                        Check Out
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<AccountBalanceWallet />}
                        onClick={() => generatePayroll({})}
                      >
                        Generate Payroll
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Employees',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Employee Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setEmployeeDialog({ open: true, employee: null })}
            >
              Add Employee
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    {/* ✅ Corrected fields */}
                    <TableCell>{employee.User?.full_name}</TableCell>
                    <TableCell>{employee.employee_id}</TableCell>
                    <TableCell>{employee.Department?.department_name}</TableCell>
                    <TableCell>{employee.Designation?.designation_title}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={employee.status === "active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {/* Edit */}
                      <IconButton
                        size="small"
                        onClick={() =>
                          setEmployeeDialog({ open: true, employee })
                        }
                      >
                        <Edit />
                      </IconButton>

                      {/* Delete */}
                      <IconButton
                        size="small"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
        </Box>
      )
    },
    {
      label: 'Attendance',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Attendance Management</Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={checkIn}
                sx={{ mr: 1 }}
              >
                Check In
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={checkOut}
              >
                Check Out
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Attendance Overview</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="present" fill="#8884d8" />
                      <Bar dataKey="absent" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Today's Status</Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Present:</Typography>
                      <Typography variant="h6" color="success.main">{stats.todayAttendance}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Absent:</Typography>
                      <Typography variant="h6" color="error.main">{stats.totalEmployees - stats.todayAttendance}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Leave Management',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Leave Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setLeaveTypeDialog({ open: true, leaveType: null })}
            >
              Add Leave Type
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Leave Type</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {leaves.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell>{leave.Employee?.User?.full_name}</TableCell>
                            <TableCell>{leave.LeaveType?.leave_type_name}</TableCell>
                            <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => approveLeave(leave.id)}>
                                <CheckCircle color="success" />
                              </IconButton>
                              <IconButton size="small" onClick={() => rejectLeave(leave.id)}>
                                <Cancel color="error" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Leave Types</Typography>
                  {leaveTypes.map((type) => (
                    <Box
                      key={type.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                    >
                      <Typography>{type.leave_type_name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {type.annual_entitlement} days
                      </Typography>
                    </Box>
                  ))}
                </CardContent>

              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Payroll',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Payroll Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => generatePayroll({})}
            >
              Generate Payroll
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payroll Summary</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Basic Salary</TableCell>
                          <TableCell>Allowances</TableCell>
                          <TableCell>Deductions</TableCell>
                          <TableCell>Net Salary</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(payrollData) && payrollData.map((payroll) => (
                          <TableRow key={payroll.id}>
                            <TableCell>{payroll.employee?.name}</TableCell>
                            <TableCell>${payroll.basicSalary}</TableCell>
                            <TableCell>${payroll.allowances}</TableCell>
                            <TableCell>${payroll.deductions}</TableCell>
                            <TableCell>${payroll.netSalary}</TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => emailPayslip(payroll.id)}>
                                <Email />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Salary Structure</Typography>
                  {salaryDetails.map((detail) => (
                    <Box key={detail.id} py={1}>
                      <Typography variant="subtitle2">{detail.designation?.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Basic: ${detail.basicSalary} | Allowances: ${detail.allowances}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      label: 'Designations',
      content: (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Designation Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDesignationDialog({ open: true, designation: null })}
            >
              Add Designation
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Designation Title</TableCell>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Min Salary - Max Salary</TableCell>
                  <TableCell>Required Experience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {designations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.designation_title}</TableCell>
                    <TableCell>{d.Department?.department_name}</TableCell>
                    <TableCell>{d.level}</TableCell>
                    <TableCell>{`${d.min_salary} - ${d.max_salary}`}</TableCell>
                    <TableCell>{d.required_experience}</TableCell>
                    <TableCell>{d.is_active ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => setDesignationDialog({ open: true, designation: d })}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteDesignation(d.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>


            </Table>
          </TableContainer>
        </Box>
      )
    }
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          {tabContent.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {tabContent[activeTab].content}
      </Box>

      {/* Employee Dialog */}
      <Dialog open={employeeDialog.open} onClose={handleCloseEmployeeDialog} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <People color="primary" />
            <Box>
              <Typography variant="h5" component="div">
                {employeeDialog.employee ? 'Edit Employee' : 'Add New Employee'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employeeDialog.employee ? 'Update employee information' : 'Fill in the details to create a new employee record'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              📋 Basic Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the user ID and provide basic employee details
            </Typography>

            <Grid container spacing={3}>
              {/* User ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="👤 User ID"
                  required
                  placeholder="e.g., 123, 456"
                  value={employeeForm.user_id}
                  onChange={(e) => handleEmployeeFormChange('user_id', e.target.value)}
                  helperText="Enter the user ID of the employee"
                  type="number"
                />
              </Grid>

              {/* Employee ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="🆔 Employee ID"
                  required
                  placeholder="e.g., EMP001, EMP2024001"
                  value={employeeForm.employee_id}
                  onChange={(e) => handleEmployeeFormChange('employee_id', e.target.value)}
                  helperText="Unique identifier for the employee"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              👤 Personal Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Personal information and demographics
            </Typography>

            <Grid container spacing={3}>
              {/* Date of Birth */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="🎂 Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={employeeForm.date_of_birth}
                  onChange={(e) => handleEmployeeFormChange('date_of_birth', e.target.value)}
                  helperText="Employee's birth date"
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>⚥ Gender</InputLabel>
                  <Select
                    value={employeeForm.gender}
                    onChange={(e) => handleEmployeeFormChange('gender', e.target.value)}
                    label="⚥ Gender"
                  >
                    <MenuItem value="male">👨 Male</MenuItem>
                    <MenuItem value="female">👩 Female</MenuItem>
                    <MenuItem value="other">👤 Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Marital Status */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>💑 Marital Status</InputLabel>
                  <Select
                    value={employeeForm.marital_status}
                    onChange={(e) => handleEmployeeFormChange('marital_status', e.target.value)}
                    label="💑 Marital Status"
                  >
                    <MenuItem value="single">💍 Single</MenuItem>
                    <MenuItem value="married">💒 Married</MenuItem>
                    <MenuItem value="divorced">💔 Divorced</MenuItem>
                    <MenuItem value="widowed">🕊️ Widowed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              💼 Employment Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Job details, department assignment, and employment terms
            </Typography>

            <Grid container spacing={3}>
              {/* Employment Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>💼 Employment Type</InputLabel>
                  <Select
                    value={employeeForm.employment_type}
                    onChange={(e) => handleEmployeeFormChange('employment_type', e.target.value)}
                    label="💼 Employment Type"
                  >
                    <MenuItem value="full-time">🕘 Full Time</MenuItem>
                    <MenuItem value="part-time">🕐 Part Time</MenuItem>
                    <MenuItem value="contract">📄 Contract</MenuItem>
                    <MenuItem value="intern">🎓 Intern</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Join Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="📅 Join Date"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={employeeForm.join_date}
                  onChange={(e) => handleEmployeeFormChange('join_date', e.target.value)}
                  helperText="When the employee started working"
                />
              </Grid>

              {/* Confirmation Date */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="✅ Confirmation Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={employeeForm.confirmation_date}
                  onChange={(e) => handleEmployeeFormChange('confirmation_date', e.target.value)}
                  helperText="When probation period ended (optional)"
                />
              </Grid>

              {/* Probation Period */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="⏳ Probation Period (Months)"
                  type="number"
                  placeholder="e.g., 3, 6, 12"
                  value={employeeForm.probation_period_months}
                  onChange={(e) => handleEmployeeFormChange('probation_period_months', e.target.value)}
                  helperText="Length of probation period in months"
                />
              </Grid>

              {/* Department */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>🏢 Department</InputLabel>
                  <Select
                    value={employeeForm.department_name}
                    onChange={(e) => handleEmployeeFormChange('department_name', e.target.value)}
                    label="🏢 Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.department_name}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Business fontSize="small" />
                          <Typography>{dept.department_name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Designation */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>🎯 Designation</InputLabel>
                  <Select
                    value={employeeForm.designation_name}
                    onChange={(e) => handleEmployeeFormChange('designation_name', e.target.value)}
                    label="🎯 Designation"
                  >
                    {designations.length === 0 ? (
                      <MenuItem disabled>
                        <Typography color="text.secondary">No designations available</Typography>
                      </MenuItem>
                    ) : (
                      designations.map((desig) => (
                        <MenuItem key={desig.id} value={desig.designation_name || desig.name || desig.designation_title}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Work fontSize="small" />
                            <Typography>{desig.designation_name || desig.name || desig.designation_title}</Typography>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {designations.length === 0
                      ? "No designations found. Please add designations first."
                      : "Select the employee's job designation"
                    }
                  </Typography>
                </FormControl>
              </Grid>

              {/* Manager */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>👔 Reporting Manager</InputLabel>
                  <Select
                    value={employeeForm.manager_id}
                    onChange={(e) => handleEmployeeFormChange('manager_id', e.target.value)}
                    label="👔 Reporting Manager"
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">No manager assigned</Typography>
                    </MenuItem>
                    {departmentManagers.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Work fontSize="small" />
                          <Box>
                            <Typography variant="body1">{manager.full_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {manager.email} • {manager.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Select a department manager as the employee's supervisor (optional)
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              🚨 Emergency Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Contact information for emergency situations
            </Typography>

            <Grid container spacing={3}>
              {/* Emergency Contact Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="👤 Emergency Contact Name"
                  placeholder="Full name of emergency contact"
                  value={employeeForm.emergency_contact_name}
                  onChange={(e) => handleEmployeeFormChange('emergency_contact_name', e.target.value)}
                  helperText="Name of person to contact in case of emergency"
                />
              </Grid>

              {/* Emergency Contact Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="📞 Emergency Contact Phone"
                  placeholder="+1 (555) 123-4567"
                  value={employeeForm.emergency_contact_phone}
                  onChange={(e) => handleEmployeeFormChange('emergency_contact_phone', e.target.value)}
                  helperText="Phone number for emergency contact"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              🏠 Address Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Employee's residential address
            </Typography>

            {/* Address */}
            <TextField
              fullWidth
              label="📍 Address"
              multiline
              rows={4}
              placeholder="Enter complete address including street, city, state, and postal code"
              value={employeeForm.address}
              onChange={(e) => handleEmployeeFormChange('address', e.target.value)}
              helperText="Complete residential address of the employee"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Fields marked with * are required
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                onClick={handleCloseEmployeeDialog}
                variant="outlined"
                size="large"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateEmployee}
                disabled={!employeeForm.user_id || !employeeForm.employee_id || !employeeForm.join_date}
                size="large"
                startIcon={<Add />}
              >
                {employeeDialog.employee ? 'Update Employee' : 'Create Employee'}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Designation Dialog */}
      <Dialog open={designationDialog.open} onClose={() => setDesignationDialog({ open: false, designation: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {designationDialog.designation ? 'Edit Designation' : 'Add New Designation'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Designation Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select label="Department">
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDesignationDialog({ open: false, designation: null })}>Cancel</Button>
          <Button variant="contained">
            {designationDialog.designation ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Leave Type Dialog */}
      <Dialog
        open={leaveTypeDialogOpen}
        onClose={() => setLeaveTypeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Leave Type</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leave Type Name"
                value={leaveTypeForm.leave_type_name}
                onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, leave_type_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={leaveTypeForm.description}
                onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Annual Entitlement"
                value={leaveTypeForm.annual_entitlement}
                onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, annual_entitlement: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Consecutive Days"
                value={leaveTypeForm.max_consecutive_days}
                onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, max_consecutive_days: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaveTypeForm.carry_forward_allowed}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, carry_forward_allowed: e.target.checked })}
                  />
                }
                label="Carry Forward Allowed"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Carry Forward Days"
                value={leaveTypeForm.max_carry_forward_days}
                onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, max_carry_forward_days: e.target.value })}
                disabled={!leaveTypeForm.carry_forward_allowed}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaveTypeForm.requires_medical_certificate}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, requires_medical_certificate: e.target.checked })}
                  />
                }
                label="Requires Medical Certificate"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaveTypeForm.is_paid}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, is_paid: e.target.checked })}
                  />
                }
                label="Paid Leave"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Applicable Gender</InputLabel>
                <Select
                  value={leaveTypeForm.applicable_gender}
                  onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, applicable_gender: e.target.value })}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaveTypeForm.is_active}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, is_active: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveTypeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={createLeaveType}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>

  )
}

export default HrDashboard
