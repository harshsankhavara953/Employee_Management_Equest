-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 21, 2025 at 06:58 PM
-- Server version: 9.1.0
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `break_duration` int DEFAULT '0',
  `total_hours` decimal(4,2) DEFAULT '0.00',
  `overtime_hours` decimal(4,2) DEFAULT '0.00',
  `status` enum('present','absent','half_day','on_leave','holiday') NOT NULL,
  `work_location` enum('office','remote','client_site') DEFAULT 'office',
  `late_arrival` tinyint(1) DEFAULT '0',
  `early_departure` tinyint(1) DEFAULT '0',
  `remarks` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `date`, `check_in_time`, `check_out_time`, `break_duration`, `total_hours`, `overtime_hours`, `status`, `work_location`, `late_arrival`, `early_departure`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-09-20', '09:45:37', '10:19:24', 60, 5.06, 0.00, 'present', 'remote', 1, 1, NULL, '2025-09-20 09:45:37', '2025-09-20 10:19:23'),
(64, 1, '2025-08-01', '09:05:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(65, 1, '2025-08-02', '09:00:00', '18:30:00', 0, 0.00, 1.50, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(66, 1, '2025-08-03', NULL, NULL, 0, 0.00, 0.00, 'absent', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(67, 1, '2025-08-04', '09:20:00', '18:10:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(68, 1, '2025-08-05', '09:00:00', '17:50:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(69, 1, '2025-08-06', '09:10:00', '19:15:00', 0, 0.00, 2.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(70, 1, '2025-08-07', NULL, NULL, 0, 0.00, 0.00, 'on_leave', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(71, 1, '2025-08-08', '09:00:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(72, 1, '2025-08-09', '09:25:00', '18:05:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(73, 1, '2025-08-10', NULL, NULL, 0, 0.00, 0.00, 'absent', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(74, 1, '2025-08-11', '09:00:00', '19:00:00', 0, 0.00, 1.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(75, 1, '2025-08-12', '09:15:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(76, 1, '2025-08-13', '09:00:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(77, 1, '2025-08-14', '09:00:00', '18:40:00', 0, 0.00, 0.50, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(78, 1, '2025-08-15', NULL, NULL, 0, 0.00, 0.00, 'on_leave', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(79, 1, '2025-08-16', '09:00:00', '17:55:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(80, 1, '2025-08-17', NULL, NULL, 0, 0.00, 0.00, 'absent', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(81, 1, '2025-08-18', '09:30:00', '18:30:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(82, 1, '2025-08-19', '09:00:00', '19:30:00', 0, 0.00, 2.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(83, 1, '2025-08-20', '09:05:00', '18:10:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(84, 1, '2025-08-21', '09:00:00', '18:20:00', 0, 0.00, 0.50, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(85, 1, '2025-08-22', '09:15:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(86, 1, '2025-08-23', NULL, NULL, 0, 0.00, 0.00, 'absent', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(87, 1, '2025-08-24', '09:00:00', '18:30:00', 0, 0.00, 1.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(88, 1, '2025-08-25', '09:20:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(89, 1, '2025-08-26', '09:00:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(90, 1, '2025-08-27', '09:10:00', '19:10:00', 0, 0.00, 1.50, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(91, 1, '2025-08-28', NULL, NULL, 0, 0.00, 0.00, 'on_leave', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(92, 1, '2025-08-29', '09:00:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(93, 1, '2025-08-30', '09:05:00', '18:30:00', 0, 0.00, 1.00, 'present', 'office', 1, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(94, 1, '2025-08-31', '09:00:00', '18:00:00', 0, 0.00, 0.00, 'present', 'office', 0, 0, NULL, '2025-09-20 15:31:08', '2025-09-20 15:31:08'),
(111, 1, '2025-09-01', '08:30:00', '17:30:00', 0, 9.00, 1.00, 'present', 'remote', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(112, 1, '2025-09-02', '09:10:00', '18:00:00', 0, 8.83, 0.83, 'present', 'remote', 1, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(113, 1, '2025-09-03', NULL, NULL, 0, 0.00, 0.00, 'absent', 'remote', 0, 0, 'Sick leave', '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(114, 1, '2025-09-04', '08:45:00', '17:45:00', 0, 9.00, 1.00, 'present', 'office', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(115, 1, '2025-09-05', '09:20:00', '13:20:00', 0, 4.00, 0.00, 'half_day', 'remote', 1, 1, 'Personal appointment', '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(116, 1, '2025-09-08', '08:30:00', '17:00:00', 30, 8.50, 0.00, 'present', 'remote', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(117, 1, '2025-09-09', NULL, NULL, 0, 0.00, 0.00, 'on_leave', 'remote', 0, 0, 'Vacation', '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(118, 1, '2025-09-10', '08:30:00', '18:30:00', 0, 10.00, 2.00, 'present', 'client_site', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(119, 1, '2025-09-11', '09:05:00', '17:55:00', 0, 8.83, 0.83, 'present', 'remote', 1, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(120, 1, '2025-09-12', NULL, NULL, 0, 0.00, 0.00, 'holiday', 'remote', 0, 0, 'Company holiday', '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(121, 1, '2025-09-15', '08:45:00', '17:45:00', 0, 9.00, 1.00, 'present', 'remote', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(122, 1, '2025-09-16', '09:15:00', '18:05:00', 0, 8.83, 0.83, 'present', 'remote', 1, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(123, 1, '2025-09-17', NULL, NULL, 0, 0.00, 0.00, 'absent', 'remote', 0, 0, 'Unplanned absence', '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(124, 1, '2025-09-18', '08:30:00', '19:00:00', 0, 10.50, 2.50, 'present', 'office', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10'),
(125, 1, '2025-09-19', '08:45:00', '17:15:00', 30, 8.50, 0.00, 'present', 'remote', 0, 0, NULL, '2025-09-20 16:13:10', '2025-09-20 16:13:10');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `department_code` varchar(10) NOT NULL,
  `manager_id` int DEFAULT NULL,
  `description` text,
  `budget` decimal(15,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `department_code`, `manager_id`, `description`, `budget`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sales', 'SL001', 1, 'Focuses on customer acquisition, relationship management, and revenue generation.', 1100000.00, 1, '2025-09-20 09:30:16', '2025-09-20 09:35:09'),
(2, 'Engineering', 'EN001', 1, 'Handles Software app', 750000.00, 1, '2025-09-20 09:32:38', '2025-09-20 09:32:38'),
(3, 'Human Resources', 'HR001', 1, 'Responsible for recruitment, employee relations, benefits administration, and organizational development.', 500000.00, 1, '2025-09-20 12:17:45', '2025-09-20 12:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int NOT NULL,
  `designation_title` varchar(100) NOT NULL,
  `department_id` int NOT NULL,
  `level` enum('junior','mid','senior','lead','manager','director') NOT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `job_description` text,
  `required_experience` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `designation_title`, `department_id`, `level`, `min_salary`, `max_salary`, `job_description`, `required_experience`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Software Engineer', 2, 'junior', 30000.00, 50000.00, 'Responsible for developing and maintaining software applications.', 0, 1, '2025-09-20 09:32:50', '2025-09-20 09:32:50'),
(2, 'Software Engineer I', 2, 'junior', 30000.00, 50000.00, 'Responsible for developing and maintaining software applications.', 0, 1, '2025-09-20 12:22:46', '2025-09-20 12:22:46'),
(3, 'Software Engineer II', 2, 'mid', 50001.00, 80000.00, 'Handles more complex development tasks and code reviews.', 2, 1, '2025-09-20 12:23:54', '2025-09-20 12:23:54'),
(4, 'Senior Software Engineer', 2, 'senior', 80001.00, 120000.00, 'Leads development projects and mentors junior engineers.', 5, 1, '2025-09-20 12:24:49', '2025-09-20 12:24:49'),
(5, 'Team Lead', 1, 'lead', 120001.00, 150000.00, 'Manages a small team of engineers and coordinates development efforts.', 6, 1, '2025-09-20 12:25:31', '2025-09-20 12:25:31');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `employee_id` varchar(20) NOT NULL,
  `department_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `marital_status` enum('single','married','divorced','widowed') DEFAULT NULL,
  `address` text,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(15) DEFAULT NULL,
  `join_date` date NOT NULL,
  `confirmation_date` date DEFAULT NULL,
  `probation_period_months` int DEFAULT '6',
  `employment_type` enum('permanent','contract','intern','consultant') DEFAULT 'permanent',
  `status` enum('active','inactive','terminated','resigned') DEFAULT 'active',
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `employee_id`, `department_id`, `designation_id`, `manager_id`, `date_of_birth`, `gender`, `marital_status`, `address`, `emergency_contact_name`, `emergency_contact_phone`, `join_date`, `confirmation_date`, `probation_period_months`, `employment_type`, `status`, `profile_photo_url`, `created_at`, `updated_at`) VALUES
(1, 3, 'EMP20253', 2, 1, NULL, '1995-07-20', 'female', 'single', '123 New Street', 'Jane kaka', '9876543210', '2022-05-10', '2022-11-10', 6, 'permanent', 'terminated', 'https://res.cloudinary.com/kevalshah/image/upload/v1758360799/employees/g8gbev2bsuqxpsy98lip.jpg', '2025-09-20 09:33:17', '2025-09-20 09:37:40'),
(2, 11, 'EMP202511', 2, 1, NULL, '1995-07-20', 'male', 'single', '123 Main Street, Gujarat, India', 'John raju', '9876501233', '2022-05-10', '2022-11-10', 6, 'permanent', 'active', 'https://res.cloudinary.com/kevalshah/image/upload/v1758371695/employees/gdinplxi9pv9tcmomr7r.jpg', '2025-09-20 12:34:54', '2025-09-20 12:34:54'),
(3, 22, 'EMP202522', 2, 5, NULL, '1995-04-15', 'male', 'single', '123 Street, City, India', 'Harsh Sankhavara', '9876534567', '2023-06-01', '2023-12-01', 6, 'permanent', 'active', 'https://res.cloudinary.com/kevalshah/image/upload/v1758401266/employees/druxxd03otu8j2zykiat.jpg', '2025-09-20 20:47:43', '2025-09-20 20:47:43'),
(4, 24, 'EMP202524', 2, 4, NULL, '2004-07-15', 'male', 'single', 'Naranpura,Ahmedabad,Gujarat,India', 'keval', '9102345678', '2025-09-01', NULL, 6, 'permanent', 'active', 'https://res.cloudinary.com/kevalshah/image/upload/v1758438856/employees/hrqq6eldqdgyu2xq7gqd.webp', '2025-09-21 07:14:13', '2025-09-21 07:14:13'),
(5, 27, 'EMP202527', 1, 5, NULL, '2004-06-08', 'male', 'single', 'DDIT', 'Kartik', '9876543210', '2025-09-19', NULL, 6, 'permanent', 'active', 'https://res.cloudinary.com/kevalshah/image/upload/v1758471822/employees/pjngrx9r7ipgdchveapm.jpg', '2025-09-21 16:23:42', '2025-09-21 16:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `leave_applications`
--

CREATE TABLE `leave_applications` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NOT NULL,
  `reason` text NOT NULL,
  `application_date` date DEFAULT NULL,
  `status` enum('pending','approved_by_manager','approved_by_hr','rejected','cancelled') DEFAULT 'pending',
  `approved_by_manager` int DEFAULT NULL,
  `manager_approval_date` datetime DEFAULT NULL,
  `manager_comments` text,
  `approved_by_hr` int DEFAULT NULL,
  `hr_approval_date` datetime DEFAULT NULL,
  `hr_comments` text,
  `is_emergency` tinyint(1) DEFAULT '0',
  `contact_during_leave` varchar(15) DEFAULT NULL,
  `handover_notes` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leave_applications`
--

INSERT INTO `leave_applications` (`id`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `total_days`, `reason`, `application_date`, `status`, `approved_by_manager`, `manager_approval_date`, `manager_comments`, `approved_by_hr`, `hr_approval_date`, `hr_comments`, `is_emergency`, `contact_during_leave`, `handover_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2025-09-25', '2025-09-29', 4, 'family trip', '2025-09-20', 'cancelled', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-09-20 13:33:41', '2025-09-20 13:37:09'),
(2, 1, 2, '2025-09-25', '2025-09-29', 4, 'family trip', '2025-09-20', 'rejected', NULL, '2025-09-20 13:47:09', NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-09-20 13:37:27', '2025-09-20 13:49:26'),
(3, 1, 2, '2025-09-25', '2025-09-28', 4, 'Trip to Kedarnath', '2025-09-20', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-09-20 13:54:58', '2025-09-20 13:54:58'),
(4, 1, 3, '2025-09-25', '2025-09-28', 4, 'Trip to jammu', '2025-09-20', 'approved_by_hr', NULL, '2025-09-20 14:48:31', NULL, NULL, '2025-09-20 14:49:47', NULL, 0, NULL, NULL, '2025-09-20 13:58:33', '2025-09-20 14:49:47');

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int NOT NULL,
  `leave_type_name` varchar(50) NOT NULL,
  `description` text,
  `annual_entitlement` int NOT NULL,
  `max_consecutive_days` int DEFAULT '30',
  `carry_forward_allowed` tinyint(1) DEFAULT '0',
  `max_carry_forward_days` int DEFAULT '0',
  `requires_medical_certificate` tinyint(1) DEFAULT '0',
  `is_paid` tinyint(1) DEFAULT '1',
  `applicable_gender` enum('all','male','female') DEFAULT 'all',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `leave_type_name`, `description`, `annual_entitlement`, `max_consecutive_days`, `carry_forward_allowed`, `max_carry_forward_days`, `requires_medical_certificate`, `is_paid`, `applicable_gender`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Annual Leave', 'Paid leave granted annually for personal purposes.', 18, 15, 1, 10, 0, 1, 'all', 1, '2025-09-20 12:49:02', '2025-09-20 12:49:02'),
(2, 'Sick Leave', 'Leave taken for illness or medical reasons.', 12, 10, 0, 0, 1, 1, 'all', 1, '2025-09-20 12:50:25', '2025-09-20 12:50:25'),
(3, 'Maternity Leave', 'Leave granted for childbirth and recovery.', 26, 180, 0, 0, 1, 1, 'female', 1, '2025-09-20 12:50:57', '2025-09-20 12:50:57'),
(5, 'Casual Leave', 'Short-term leave for personal emergencies.', 8, 5, 0, 0, 0, 1, 'all', 1, '2025-09-20 12:51:39', '2025-09-20 12:51:39'),
(6, 'Coding Leave', 'frontend leave', 8, 5, 1, 0, 0, 1, 'male', 1, '2025-09-21 14:22:56', '2025-09-21 14:22:56'),
(7, 'Backend Leave', 'Coding purpose', 6, 3, 1, 0, 0, 1, 'male', 1, '2025-09-21 14:30:22', '2025-09-21 14:30:22'),
(8, 'Test Leave', 'Test Description', 6, 2, 1, 1, 0, 1, 'male', 1, '2025-09-21 16:17:49', '2025-09-21 16:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `pay_period_start` date NOT NULL,
  `pay_period_end` date NOT NULL,
  `working_days` int NOT NULL,
  `present_days` int NOT NULL,
  `absent_days` int NOT NULL,
  `paid_leaves` int DEFAULT '0',
  `unpaid_leaves` int DEFAULT '0',
  `basic_salary` decimal(10,2) NOT NULL,
  `gross_earnings` decimal(10,2) NOT NULL,
  `total_deductions` decimal(10,2) NOT NULL,
  `net_salary` decimal(10,2) NOT NULL,
  `overtime_amount` decimal(8,2) DEFAULT '0.00',
  `bonus_amount` decimal(8,2) DEFAULT '0.00',
  `payroll_status` enum('draft','processed','paid') DEFAULT 'draft',
  `payment_date` datetime DEFAULT NULL,
  `payment_method` enum('bank_transfer','cheque','cash') DEFAULT 'bank_transfer',
  `bank_reference` varchar(100) DEFAULT NULL,
  `generated_by` int NOT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payroll`
--

INSERT INTO `payroll` (`id`, `employee_id`, `pay_period_start`, `pay_period_end`, `working_days`, `present_days`, `absent_days`, `paid_leaves`, `unpaid_leaves`, `basic_salary`, `gross_earnings`, `total_deductions`, `net_salary`, `overtime_amount`, `bonus_amount`, `payroll_status`, `payment_date`, `payment_method`, `bank_reference`, `generated_by`, `processed_at`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 55000.00, 85600.00, 15160.00, 70440.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-20 18:51:59', '2025-09-20 18:51:59'),
(2, 2, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 60000.00, 93100.00, 16510.00, 76590.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-20 19:34:26', '2025-09-20 19:34:26'),
(3, 2, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 60000.00, 81500.00, 11500.00, 70000.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-20 19:48:53', '2025-09-20 19:48:53'),
(4, 2, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 60000.00, 81500.00, 11500.00, 70000.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-20 19:56:20', '2025-09-20 19:56:20'),
(5, 2, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 60000.00, 81500.00, 11500.00, 70000.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-20 20:05:09', '2025-09-20 20:05:09'),
(6, 2, '2025-09-01', '2025-09-30', 30, 25, 2, 3, 0, 60000.00, 81500.00, 11500.00, 70000.00, 0.00, 0.00, 'draft', NULL, 'bank_transfer', NULL, 13, NULL, '2025-09-21 16:26:14', '2025-09-21 16:26:14');

-- --------------------------------------------------------

--
-- Table structure for table `performance_reviews`
--

CREATE TABLE `performance_reviews` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `reviewer_id` int NOT NULL,
  `review_period_start` date NOT NULL,
  `review_period_end` date NOT NULL,
  `review_type` enum('annual','mid_year','probation','project_based') NOT NULL,
  `goal_achievement_rating` int DEFAULT NULL,
  `technical_skills_rating` int DEFAULT NULL,
  `soft_skills_rating` int DEFAULT NULL,
  `initiative_rating` int DEFAULT NULL,
  `overall_rating` decimal(3,2) DEFAULT NULL,
  `strengths` text,
  `areas_for_improvement` text,
  `goals_for_next_period` text,
  `reviewer_comments` text,
  `employee_comments` text,
  `review_status` enum('draft','submitted','acknowledged','finalized') DEFAULT 'draft',
  `review_date` datetime DEFAULT NULL,
  `acknowledgment_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_details`
--

CREATE TABLE `salary_details` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) DEFAULT '0.00',
  `da` decimal(8,2) DEFAULT '0.00',
  `medical_allowance` decimal(8,2) DEFAULT '0.00',
  `conveyance_allowance` decimal(8,2) DEFAULT '0.00',
  `special_allowance` decimal(8,2) DEFAULT '0.00',
  `gross_salary` decimal(10,2) NOT NULL,
  `pf_contribution` decimal(8,2) DEFAULT '0.00',
  `professional_tax` decimal(6,2) DEFAULT '0.00',
  `income_tax` decimal(8,2) DEFAULT '0.00',
  `other_deductions` decimal(8,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `salary_details`
--

INSERT INTO `salary_details` (`id`, `employee_id`, `basic_salary`, `hra`, `da`, `medical_allowance`, `conveyance_allowance`, `special_allowance`, `gross_salary`, `pf_contribution`, `professional_tax`, `income_tax`, `other_deductions`, `net_salary`, `effective_from`, `effective_to`, `is_current`, `created_at`, `updated_at`) VALUES
(2, 1, 55000.00, 11000.00, 0.00, 0.00, 0.00, 0.00, 76500.00, 0.00, 0.00, 0.00, 0.00, 65005.00, '2025-10-01', NULL, 1, '2025-09-20 18:06:26', '2025-09-20 18:07:08'),
(3, 2, 60000.00, 10000.00, 5000.00, 2000.00, 1500.00, 3000.00, 71500.00, 6000.00, 200.00, 5000.00, 300.00, 60000.00, '2025-09-01', NULL, 1, '2025-09-20 19:13:04', '2025-09-20 19:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `user_type` enum('hr_manager','department_manager','employee','admin') NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_type`, `email`, `password_hash`, `full_name`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'department_manager', 'sarah.johnson@company.com', '$2b$10$TkXDpDRmkE4bpPVuhBhlPu9XqJhg0eeViz7ZgtOhX3ojgvZ9KcShO', 'Sarah Johnson', '9876543211', 1, '2025-09-20 09:27:59', '2025-09-20 09:27:59'),
(2, 'admin', 'keval@company.com', '$2b$10$Jo7qW8I5JEUa7o34XhtUhOHpx2/s9O0Fxqqtm6JIjjFjke6fzdZ3C', 'keval shah', '9876543210', 1, '2025-09-20 09:28:52', '2025-09-20 09:28:52'),
(3, 'employee', 'jane.doe@example.com', '$2b$10$x2MGVbCPdSgoe.jpNM9v4OREgZkuxxyZBeISQ0Nx74JX2Cl5s4GRi', 'Jane Doe', '9876543210', 1, '2025-09-20 09:33:14', '2025-09-20 09:33:14'),
(4, 'hr_manager', 'mayur@company.com', '$2b$10$1SusHDC7pNeSw8ht/DtBNOyTYwHdiBekHrQX8DjT58s09S1wj9rvC', 'Mayurdhwajsinh Jadeja', '9876543310', 1, '2025-09-20 09:41:09', '2025-09-20 09:41:09'),
(5, 'department_manager', 'john.smith@company.com', '$2b$10$QDh8Q8SJpsKA/8l07YdEQ.W0D/FtQ.zcTJ4spKwAPOk5UQzmjH0dm', 'John Smith', '9876543210', 1, '2025-09-20 12:15:14', '2025-09-20 12:15:14'),
(6, 'department_manager', 'mike.wilson@company.com', '$2b$10$8FbRRpBxNhoBtxPTrwfKxOzjNmHaYetRFUcQZzWsLfLrSFj6KkNaK', 'Mike Wilson', '9876543212', 1, '2025-09-20 12:15:36', '2025-09-20 12:15:36'),
(7, 'department_manager', 'lisa.brown@company.com', '$2b$10$VhVjkgRneTbaxPSAVtR2GO5Stg/SOaMyu0LOOKJy1EV7LzrsoaGZe', 'Lisa Brown', '9876543213', 1, '2025-09-20 12:15:49', '2025-09-20 12:15:49'),
(8, 'department_manager', 'david.davis@company.com', '$2b$10$DjGSVjWsjpyYBfzrEIosM.2HNPzghSwvnIKuKboE1sY/rU7ZoYliO', 'David Davis', '9876543214', 1, '2025-09-20 12:16:07', '2025-09-20 12:16:07'),
(9, 'hr_manager', 'hr.manager@company.com', '$2b$10$VkyOsO/WzQ3PogEA5CRrde8XwzKTJcRYRZvhSDiN5Xxwzjczxk8UO', 'HR Manager', '9876543216', 1, '2025-09-20 12:16:28', '2025-09-20 12:16:28'),
(11, 'employee', 'employee1@example.com', '$2b$10$m9lGqzICHv3qghDWtnJ0ZOqyNGNsxZp6iPmWdUYh0vX3B2ETY4JBS', 'Keval Shah', '9876543212', 1, '2025-09-20 12:34:50', '2025-09-20 12:34:50'),
(12, 'department_manager', 'department.manager@company.com', '$2b$10$ggwE.doJ7cLzM2aO6TMGcerobubJd8XK2hGVOmfyuUhW8ax/jEJIm', 'department Manager', '9876543416', 1, '2025-09-20 13:45:34', '2025-09-20 13:45:34'),
(13, 'hr_manager', 'hr.manager@example.com', '$2b$10$b4Cx.3wd9FJHb7g.5lw1A.aA0cz5RpwdGfw0RZ3MU217QI2xqotKu', 'hr Manager', '9876543516', 1, '2025-09-20 14:47:20', '2025-09-20 14:47:20'),
(22, 'employee', '24mapog067@ddu.ac.in', '$2b$10$K1FV6XRUXk5SAQUX5h3aOOAHFASQ9VjLyE1ZuT4DilNyVKpkaBLXO', 'keval shah', '9876523456', 1, '2025-09-20 20:47:40', '2025-09-20 20:47:40'),
(23, 'department_manager', 'harshsankhavara98@gmail.com', '$2b$10$yyOXpCQWi72fXzDHg9Xv3.mSac/IlzTnm3XGCXPFut/V8xU0GS6hK', 'harsh', '9876540987', 1, '2025-09-21 06:59:41', '2025-09-21 06:59:41'),
(24, 'employee', 'keval1507@gmail.com', '$2b$10$YYL1qy7VOrEgh2W6r4D66.cFo4XpS1M8OpOcY8HWaK71mCd33sW2O', 'keval', '8976543210', 1, '2025-09-21 07:14:10', '2025-09-21 07:14:10'),
(25, 'hr_manager', 'mayurjadeja6@gmail.com', '$2b$10$n2VnIMPZ.J3.gDMSyIOuReAfR72kzo0gDcosIc9XME5tWzxovv9tO', 'mayur', '9876543211', 1, '2025-09-21 07:42:38', '2025-09-21 07:42:38'),
(26, 'hr_manager', 'kartik@gmail.com', '$2b$10$1kCrNe4UA1B2pdIiW1ARMOdBTIOeEzqqTf9sVL2r3dM0Ho1aX9kiO', 'Kartik', '9102345678', 1, '2025-09-21 16:16:20', '2025-09-21 16:16:20'),
(27, 'employee', 'harshsankh12@gmail.com', '$2b$10$t7IKlKs.lnnAttFlMGzbsuwCF5w9IlRNWlVyKYOg8CCGT5iUZSttu', 'Harsh', '9765432109', 1, '2025-09-21 16:23:38', '2025-09-21 16:23:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendance_employee_id_date` (`employee_id`,`date`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_name` (`department_name`),
  ADD UNIQUE KEY `department_code` (`department_code`),
  ADD UNIQUE KEY `department_name_2` (`department_name`),
  ADD UNIQUE KEY `department_code_2` (`department_code`),
  ADD UNIQUE KEY `department_name_3` (`department_name`),
  ADD UNIQUE KEY `department_code_3` (`department_code`),
  ADD UNIQUE KEY `department_name_4` (`department_name`),
  ADD UNIQUE KEY `department_code_4` (`department_code`),
  ADD UNIQUE KEY `department_name_5` (`department_name`),
  ADD UNIQUE KEY `department_code_5` (`department_code`),
  ADD UNIQUE KEY `department_name_6` (`department_name`),
  ADD UNIQUE KEY `department_code_6` (`department_code`),
  ADD UNIQUE KEY `department_name_7` (`department_name`),
  ADD UNIQUE KEY `department_code_7` (`department_code`),
  ADD UNIQUE KEY `department_name_8` (`department_name`),
  ADD UNIQUE KEY `department_code_8` (`department_code`),
  ADD UNIQUE KEY `department_name_9` (`department_name`),
  ADD UNIQUE KEY `department_code_9` (`department_code`),
  ADD UNIQUE KEY `department_name_10` (`department_name`),
  ADD UNIQUE KEY `department_code_10` (`department_code`),
  ADD UNIQUE KEY `department_name_11` (`department_name`),
  ADD UNIQUE KEY `department_code_11` (`department_code`),
  ADD UNIQUE KEY `department_name_12` (`department_name`),
  ADD UNIQUE KEY `department_code_12` (`department_code`),
  ADD UNIQUE KEY `department_name_13` (`department_name`),
  ADD UNIQUE KEY `department_code_13` (`department_code`),
  ADD UNIQUE KEY `department_name_14` (`department_name`),
  ADD UNIQUE KEY `department_name_15` (`department_name`),
  ADD UNIQUE KEY `department_code_14` (`department_code`),
  ADD UNIQUE KEY `department_name_16` (`department_name`),
  ADD UNIQUE KEY `department_code_15` (`department_code`),
  ADD UNIQUE KEY `department_name_17` (`department_name`),
  ADD UNIQUE KEY `department_code_16` (`department_code`),
  ADD UNIQUE KEY `department_name_18` (`department_name`),
  ADD UNIQUE KEY `department_code_17` (`department_code`),
  ADD UNIQUE KEY `department_name_19` (`department_name`),
  ADD UNIQUE KEY `department_code_18` (`department_code`),
  ADD UNIQUE KEY `department_name_20` (`department_name`),
  ADD UNIQUE KEY `department_code_19` (`department_code`),
  ADD UNIQUE KEY `department_name_21` (`department_name`),
  ADD UNIQUE KEY `department_code_20` (`department_code`),
  ADD UNIQUE KEY `department_name_22` (`department_name`),
  ADD UNIQUE KEY `department_code_21` (`department_code`),
  ADD UNIQUE KEY `department_name_23` (`department_name`),
  ADD UNIQUE KEY `department_code_22` (`department_code`),
  ADD UNIQUE KEY `department_name_24` (`department_name`),
  ADD UNIQUE KEY `department_code_23` (`department_code`),
  ADD UNIQUE KEY `department_name_25` (`department_name`),
  ADD UNIQUE KEY `department_code_24` (`department_code`),
  ADD UNIQUE KEY `department_name_26` (`department_name`),
  ADD UNIQUE KEY `department_code_25` (`department_code`),
  ADD UNIQUE KEY `department_name_27` (`department_name`),
  ADD UNIQUE KEY `department_code_26` (`department_code`),
  ADD UNIQUE KEY `department_name_28` (`department_name`),
  ADD UNIQUE KEY `department_code_27` (`department_code`),
  ADD UNIQUE KEY `department_name_29` (`department_name`),
  ADD UNIQUE KEY `department_name_30` (`department_name`),
  ADD UNIQUE KEY `department_code_28` (`department_code`),
  ADD UNIQUE KEY `department_name_31` (`department_name`),
  ADD UNIQUE KEY `department_code_29` (`department_code`),
  ADD UNIQUE KEY `department_name_32` (`department_name`),
  ADD UNIQUE KEY `department_code_30` (`department_code`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `employee_id_2` (`employee_id`),
  ADD UNIQUE KEY `employee_id_3` (`employee_id`),
  ADD UNIQUE KEY `employee_id_4` (`employee_id`),
  ADD UNIQUE KEY `employee_id_5` (`employee_id`),
  ADD UNIQUE KEY `employee_id_6` (`employee_id`),
  ADD UNIQUE KEY `employee_id_7` (`employee_id`),
  ADD UNIQUE KEY `employee_id_8` (`employee_id`),
  ADD UNIQUE KEY `employee_id_9` (`employee_id`),
  ADD UNIQUE KEY `employee_id_10` (`employee_id`),
  ADD UNIQUE KEY `employee_id_11` (`employee_id`),
  ADD UNIQUE KEY `employee_id_12` (`employee_id`),
  ADD UNIQUE KEY `employee_id_13` (`employee_id`),
  ADD UNIQUE KEY `employee_id_14` (`employee_id`),
  ADD UNIQUE KEY `employee_id_15` (`employee_id`),
  ADD UNIQUE KEY `employee_id_16` (`employee_id`),
  ADD UNIQUE KEY `employee_id_17` (`employee_id`),
  ADD UNIQUE KEY `employee_id_18` (`employee_id`),
  ADD UNIQUE KEY `employee_id_19` (`employee_id`),
  ADD UNIQUE KEY `employee_id_20` (`employee_id`),
  ADD UNIQUE KEY `employee_id_21` (`employee_id`),
  ADD UNIQUE KEY `employee_id_22` (`employee_id`),
  ADD UNIQUE KEY `employee_id_23` (`employee_id`),
  ADD UNIQUE KEY `employee_id_24` (`employee_id`),
  ADD UNIQUE KEY `employee_id_25` (`employee_id`),
  ADD UNIQUE KEY `employee_id_26` (`employee_id`),
  ADD UNIQUE KEY `employee_id_27` (`employee_id`),
  ADD UNIQUE KEY `employee_id_28` (`employee_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `designation_id` (`designation_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `leave_applications`
--
ALTER TABLE `leave_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `leave_type_id` (`leave_type_id`),
  ADD KEY `approved_by_manager` (`approved_by_manager`),
  ADD KEY `approved_by_hr` (`approved_by_hr`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_type_name` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_2` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_3` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_4` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_5` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_6` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_7` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_8` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_9` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_10` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_11` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_12` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_13` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_14` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_15` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_16` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_17` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_18` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_19` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_20` (`leave_type_name`),
  ADD UNIQUE KEY `leave_type_name_21` (`leave_type_name`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `reviewer_id` (`reviewer_id`);

--
-- Indexes for table `salary_details`
--
ALTER TABLE `salary_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `leave_applications`
--
ALTER TABLE `leave_applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary_details`
--
ALTER TABLE `salary_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_10` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_11` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_12` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_13` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_14` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_15` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_16` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_17` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_18` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_19` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_20` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_21` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_22` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_4` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_6` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_7` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_8` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_9` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_10` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_11` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_12` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_13` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_14` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_15` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_16` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_17` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_18` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_19` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_20` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_21` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_22` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_23` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_24` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_25` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_26` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_27` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_28` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_29` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_3` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_30` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_4` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_5` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_6` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_7` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_8` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `departments_ibfk_9` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_10` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_11` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_12` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_13` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_14` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_15` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_16` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_17` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_18` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_19` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_20` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_21` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_22` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_23` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_24` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_25` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_26` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_27` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_28` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_29` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_4` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_5` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_6` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_7` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_8` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `designations_ibfk_9` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_10` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_100` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_101` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_102` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_103` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_104` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_105` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_106` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_107` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_108` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_109` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_11` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_110` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_12` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_14` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_15` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_16` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_18` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_19` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_21` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_22` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_23` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_25` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_26` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_28` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_29` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_30` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_32` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_33` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_34` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_36` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_37` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_38` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_40` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_41` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_42` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_44` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_45` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_46` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_48` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_49` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_50` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_51` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_52` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_53` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_54` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_55` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_56` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_57` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_58` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_59` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_6` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_60` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_61` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_62` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_63` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_64` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_65` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_66` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_67` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_68` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_69` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_7` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_70` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_71` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_72` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_73` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_74` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_75` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_76` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_77` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_78` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_79` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_8` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_80` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_81` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_82` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_83` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_84` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_85` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_86` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_87` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_88` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_89` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_90` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_92` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_93` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_94` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_95` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_96` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_97` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_98` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_99` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leave_applications`
--
ALTER TABLE `leave_applications`
  ADD CONSTRAINT `leave_applications_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_10` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_11` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_12` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_13` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_14` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_15` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_16` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_17` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_18` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_19` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_20` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_21` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_22` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_23` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_24` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_25` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_26` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_27` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_28` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_29` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_3` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_30` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_31` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_32` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_33` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_34` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_35` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_36` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_37` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_38` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_39` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_4` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_40` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_41` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_42` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_43` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_44` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_45` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_46` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_47` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_48` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_49` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_50` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_51` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_52` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_53` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_54` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_55` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_56` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_57` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_58` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_59` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_6` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_60` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_61` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_62` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_63` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_64` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_65` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_66` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_67` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_68` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_69` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_7` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_70` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_71` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_72` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_73` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_74` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_75` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_76` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_77` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_78` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_79` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_8` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_80` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_81` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_82` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_83` FOREIGN KEY (`approved_by_manager`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_84` FOREIGN KEY (`approved_by_hr`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_applications_ibfk_9` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_10` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_11` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_12` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_13` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_14` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_15` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_16` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_17` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_18` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_19` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_2` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_20` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_21` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_22` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_23` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_24` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_25` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_26` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_27` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_28` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_29` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_30` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_31` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_32` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_33` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_34` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_35` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_36` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_37` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_38` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_39` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_4` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_40` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_6` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_7` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_8` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_9` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_10` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_11` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_12` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_13` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_14` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_15` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_16` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_17` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_18` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_19` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_20` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_21` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_22` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_23` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_24` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_25` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_26` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_27` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_28` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_29` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_30` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_31` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_32` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_33` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_34` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_35` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_36` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_37` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_38` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_39` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_4` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_40` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_6` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_7` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_8` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_9` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `salary_details`
--
ALTER TABLE `salary_details`
  ADD CONSTRAINT `salary_details_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_10` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_11` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_12` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_13` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_14` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_15` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_16` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_17` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_18` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_19` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_20` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_21` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_4` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_5` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_6` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_7` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_8` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_details_ibfk_9` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
