// src/pages/RegisterForm.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api"; // adjust path if needed
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        user_type: "",
        // employee-specific (match backend required names)
        date_of_birth: "",
        join_date: "",
        gender: "",
        marital_status: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        department_id: "",
        designation_id: "",
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch departments + designations on mount
    useEffect(() => {
        let mounted = true;
        const fetchLists = async () => {
            try {
                const [depRes, desRes] = await Promise.all([
                    api.get("/department"),
                    api.get("/designations"),
                ]);
                if (!mounted) return;
                setDepartments(depRes.data.data || []);
                setDesignations(desRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch departments/designations", err);
                toast.error("Failed to load departments/designations");
            }
        };
        fetchLists();
        return () => { mounted = false; };
    }, []);

    // Filtered designations by selected department (if department filter desired)
    const filteredDesignations = designations.filter((d) =>
        formData.department_id ? Number(d.department_id) === Number(formData.department_id) : true
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    // Basic front-end checks (complements backend validation)
    const validateBeforeSubmit = () => {
        // password match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        // basic phone check (10 digits) if provided
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            toast.error("Phone must be 10 digits");
            return false;
        }

        // if employee selected, ensure required employee fields exist (match backend)
        if (formData.user_type === "employee") {
            const required = [
                "date_of_birth",
                "join_date",
                "gender",
                "marital_status",
                "address",
                "emergency_contact_name",
                "emergency_contact_phone",
                "department_id",
                "designation_id",
            ];
            const missing = required.filter((k) => !formData[k] || String(formData[k]).trim() === "");
            if (missing.length) {
                toast.error(`Please fill required employee fields: ${missing.join(", ")}`);
                return false;
            }

            // DOB age check (18-65)
            const dob = new Date(formData.date_of_birth);
            if (Number.isNaN(dob.getTime())) {
                toast.error("Invalid date of birth");
                return false;
            }
            const age = new Date().getFullYear() - dob.getFullYear();
            if (age < 18 || age > 65) {
                toast.error("Employee age must be between 18 and 65");
                return false;
            }

            // join_date not in future
            if (new Date(formData.join_date) > new Date()) {
                toast.error("Join date cannot be in the future");
                return false;
            }

            // emergency phone check
            if (!/^\d{10}$/.test(formData.emergency_contact_phone)) {
                toast.error("Emergency contact phone must be 10 digits");
                return false;
            }
        }

        // minimal email presence (backend will do full validation)
        if (!formData.email) {
            toast.error("Email is required");
            return false;
        }

        // user_type required
        if (!formData.user_type) {
            toast.error("Please select a user type");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateBeforeSubmit()) return;

        setLoading(true);
        try {
            const payload = new FormData();

            // Append plain fields (exclude confirmPassword)
            const sendObj = { ...formData };
            delete sendObj.confirmPassword;

            Object.keys(sendObj).forEach((k) => {
                // ensure null/undefined are sent as empty strings or omitted
                if (sendObj[k] !== undefined && sendObj[k] !== null) {
                    payload.append(k, sendObj[k]);
                }
            });

            if (file) {
                // backend expects file under field name 'profile_photo'
                payload.append("profile_photo_url", file);
            }

            // Use your api instance
            const res = await api.post("/auth/register", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(res.data.message || "User registered successfully");
            navigate("/login");
            // Reset form (keep departments/designations lists)
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                user_type: "",
                date_of_birth: "",
                join_date: "",
                gender: "",
                marital_status: "",
                address: "",
                emergency_contact_name: "",
                emergency_contact_phone: "",
                department_id: "",
                designation_id: "",
            });
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error("Registration error:", err);
            const msg = err?.response?.data?.message || "Registration failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Photo */}


                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                        placeholder="10 digits"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                {/* User Type */}
                <div>
                    <label className="block text-sm font-medium">User Type</label>
                    <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="employee">Employee</option>
                        <option value="department_manager">Department Manager</option>
                        <option value="hr_manager">HR Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Employee-specific fields */}
                {formData.user_type === "employee" && (
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Employee Details</h3>
                        <div>
                            <label className="block text-sm font-medium">Profile Photo (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 w-full"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 w-24 h-24 rounded-full object-cover border"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Join Date</label>
                            <input
                                type="date"
                                name="join_date"
                                value={formData.join_date}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Marital Status</label>
                                <select
                                    name="marital_status"
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Emergency Contact Name</label>
                                <input
                                    type="text"
                                    name="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={handleChange}
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Emergency Contact Phone</label>
                                <input
                                    type="tel"
                                    name="emergency_contact_phone"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                    className="mt-1 w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Department</label>
                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.department_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Designation</label>
                            <select
                                name="designation_id"
                                value={formData.designation_id}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg px-3 py-2"
                                required
                            >
                                <option value="">Select Designation</option>
                                {filteredDesignations.map((des) => (
                                    <option key={des.id} value={des.id}>
                                        {des.designation_title || des.designation_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
